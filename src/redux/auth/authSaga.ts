import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";
import type { CallEffect, PutEffect } from "redux-saga/effects";
import { auth, googleProvider } from "../../lib/firebase/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";
import {
  loginWithGoogleRequest,
  loginWithEmailRequest,
  registerWithEmailRequest,
  loginSuccess,
  loginFailure,
} from "./authSlice";
import type { User } from "./types";

function* handleGoogleLogin(): Generator<
  CallEffect<UserCredential> | PutEffect<{ type: string }>,
  void,
  UserCredential
> {
  try {
    const result: UserCredential = yield call(
      signInWithPopup,
      auth,
      googleProvider
    );
    const firebaseUser = result.user;
    const user: User = {
      uid: firebaseUser.uid ?? "",
      email: firebaseUser.email ?? "",
      displayName: firebaseUser.displayName ?? "",
      photoURL: firebaseUser.photoURL ?? "",
    };

    yield put(loginSuccess(user));
  } catch (err: unknown) {
    const errorMessage = getFirebaseErrorMessage(
      (err as { code?: string })?.code ?? ""
    );
    yield put(loginFailure(errorMessage));
  }
}

function* handleEmailLogin(
  action: PayloadAction<{ email: string; password: string }>
): Generator<
  CallEffect<UserCredential> | PutEffect<{ type: string }>,
  void,
  UserCredential
> {
  try {
    const userCredential: UserCredential = yield call(
      signInWithEmailAndPassword,
      auth,
      action.payload.email,
      action.payload.password
    );
    const firebaseUser = userCredential.user;
    const user: User = {
      uid: firebaseUser.uid ?? "",
      email: firebaseUser.email ?? "",
      displayName: firebaseUser.displayName ?? "",
      photoURL: firebaseUser.photoURL ?? "",
    };

    yield put(loginSuccess(user));
  } catch (err: unknown) {
    const errorMessage = getFirebaseErrorMessage(
      (err as { code?: string })?.code ?? ""
    );
    yield put(loginFailure(errorMessage));
  }
}

function* handleRegister(
  action: PayloadAction<{ email: string; password: string }>
): Generator<
  CallEffect<UserCredential> | PutEffect<{ type: string }>,
  void,
  UserCredential
> {
  try {
    const userCredential: UserCredential = yield call(
      createUserWithEmailAndPassword,
      auth,
      action.payload.email,
      action.payload.password
    );
    const firebaseUser = userCredential.user;
    const user: User = {
      uid: firebaseUser.uid ?? "",
      email: firebaseUser.email ?? "",
      displayName: firebaseUser.displayName ?? "",
      photoURL: firebaseUser.photoURL ?? "",
    };

    yield put(loginSuccess(user));
  } catch (err: unknown) {
    const errorMessage = getFirebaseErrorMessage(
      (err as { code?: string })?.code ?? ""
    );
    yield put(loginFailure(errorMessage));
  }
}

export default function* authSaga() {
  yield takeLatest(loginWithGoogleRequest.type, handleGoogleLogin);
  yield takeLatest(loginWithEmailRequest.type, handleEmailLogin);
  yield takeLatest(registerWithEmailRequest.type, handleRegister);
}
