FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

COPY .env.local .

RUN npm ci

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN echo '#!/bin/sh' > /docker-entrypoint.d/check-files.sh && \
    echo 'echo "Contents of /usr/share/nginx/html:"' >> /docker-entrypoint.d/check-files.sh && \
    echo 'ls -la /usr/share/nginx/html' >> /docker-entrypoint.d/check-files.sh && \
    chmod +x /docker-entrypoint.d/check-files.sh

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
