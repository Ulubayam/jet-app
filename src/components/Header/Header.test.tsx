import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Header } from "./Header";
import authReducer from "../../redux/auth/authSlice";
import * as firebaseAuth from "firebase/auth";

jest.mock("firebase/auth", () => {
  const mockOnAuthStateChanged = jest.fn();
  const mockSignOut = jest.fn();
  return {
    onAuthStateChanged: mockOnAuthStateChanged,
    signOut: mockSignOut,
    __esModule: true,
    _mockOnAuthStateChanged: mockOnAuthStateChanged,
    _mockSignOut: mockSignOut,
  };
});

jest.mock("../../lib/firebase/firebase", () => ({
  auth: {
    currentUser: null,
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../UserProfileDropdown", () => ({
  UserProfileDropdown: ({
    userEmail,
    onSignOut,
  }: {
    userEmail: string;
    onSignOut: () => void;
  }) => (
    <div data-testid="user-profile-dropdown">
      <span>{userEmail}</span>
      <button onClick={onSignOut} data-testid="sign-out-btn">
        Sign Out
      </button>
    </div>
  ),
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createMockStore();
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (firebaseAuth as any)._mockOnAuthStateChanged.mockReturnValue(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (firebaseAuth as any)._mockSignOut.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render header with logo and correct navigation link", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByText("JET App")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "JET App" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("should display sign in button when user is not authenticated", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(
      screen.queryByTestId("user-profile-dropdown")
    ).not.toBeInTheDocument();
  });

  it("should navigate to login page when sign in button is clicked", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    const signInButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.click(signInButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should display user profile dropdown when user is authenticated", async () => {
    const mockUser = {
      email: "test@example.com",
      uid: "123",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (firebaseAuth as any)._mockOnAuthStateChanged.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_auth: any, callback: (user: any) => void) => {
        callback(mockUser);
        return () => {};
      }
    );

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-profile-dropdown")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: "Sign In" })
    ).not.toBeInTheDocument();
  });

  it("should handle sign out process when user clicks sign out button", async () => {
    const mockUser = {
      email: "test@example.com",
      uid: "123",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (firebaseAuth as any)._mockOnAuthStateChanged.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_auth: any, callback: (user: any) => void) => {
        callback(mockUser);
        return () => {};
      }
    );

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-profile-dropdown")).toBeInTheDocument();
    });

    const signOutButton = screen.getByTestId("sign-out-btn");
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((firebaseAuth as any)._mockSignOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it('should display "User" as fallback when user email is null', async () => {
    const mockUser = {
      email: null,
      uid: "123",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (firebaseAuth as any)._mockOnAuthStateChanged.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_auth: any, callback: (user: any) => void) => {
        callback(mockUser);
        return () => {};
      }
    );

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("User")).toBeInTheDocument();
    });
  });

  it("should clean up auth state listener when component unmounts", () => {
    const unsubscribe = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (firebaseAuth as any)._mockOnAuthStateChanged.mockReturnValue(unsubscribe);

    const { unmount } = render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it("should render with correct CSS classes for styling", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("header");

    const logo = screen.getByRole("link", { name: "JET App" });
    expect(logo).toHaveClass("logo");

    const headerActions = header.querySelector(".header-actions");
    expect(headerActions).toBeInTheDocument();
  });
});
