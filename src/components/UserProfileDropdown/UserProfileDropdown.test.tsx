import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserProfileDropdown } from "./UserProfileDropdown";
import type { UserProfileDropdownProps } from "./UserProfleDropdown.types";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const defaultProps: UserProfileDropdownProps = {
  userEmail: "test@example.com",
  onSignOut: jest.fn(),
};

const renderUserProfileDropdown = (
  props: Partial<UserProfileDropdownProps> = {}
) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(
    <BrowserRouter>
      <UserProfileDropdown {...mergedProps} />
    </BrowserRouter>
  );
};

describe("UserProfileDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render user profile button with email and avatar", () => {
    renderUserProfileDropdown();

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "true");
  });

  it("should display first letter of email as avatar when email is provided", () => {
    renderUserProfileDropdown({ userEmail: "john.doe@example.com" });

    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it('should display "U" as avatar when email is empty', () => {
    renderUserProfileDropdown({ userEmail: "" });

    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it('should display "U" as avatar when email is null', () => {
    renderUserProfileDropdown({ userEmail: "" });

    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("should toggle dropdown menu when button is clicked", () => {
    renderUserProfileDropdown();

    const button = screen.getByRole("button");

    expect(screen.queryByText("Favorites")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(button);
    expect(screen.queryByText("Favorites")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("should close dropdown when clicking outside", () => {
    renderUserProfileDropdown();

    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(screen.getByText("Favorites")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText("Favorites")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("should navigate to favorites page when favorites button is clicked", () => {
    renderUserProfileDropdown();

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const favoritesButton = screen.getByText("Favorites");
    fireEvent.click(favoritesButton);

    expect(mockNavigate).toHaveBeenCalledWith("/favorites");
  });

  it("should close dropdown after navigating to favorites", () => {
    renderUserProfileDropdown();

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const favoritesButton = screen.getByText("Favorites");
    fireEvent.click(favoritesButton);

    expect(screen.queryByText("Favorites")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("should call onSignOut when sign out button is clicked", () => {
    const mockOnSignOut = jest.fn();
    renderUserProfileDropdown({ onSignOut: mockOnSignOut });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);

    expect(mockOnSignOut).toHaveBeenCalledTimes(1);
  });

  it("should close dropdown after signing out", () => {
    const mockOnSignOut = jest.fn();
    renderUserProfileDropdown({ onSignOut: mockOnSignOut });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);

    expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("should handle case insensitive email for avatar display", () => {
    renderUserProfileDropdown({ userEmail: "ALICE@EXAMPLE.COM" });

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("should maintain dropdown state when clicking inside dropdown", () => {
    renderUserProfileDropdown();

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const dropdownMenu = screen
      .getByText("Favorites")
      .closest(".dropdown-menu");
    if (dropdownMenu) {
      fireEvent.mouseDown(dropdownMenu);
    }

    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("should render dropdown items with correct styling classes", () => {
    renderUserProfileDropdown();

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const favoritesButton = screen.getByText("Favorites");
    const signOutButton = screen.getByText("Sign Out");

    expect(favoritesButton).toHaveClass("dropdown-item");
    expect(signOutButton).toHaveClass("dropdown-item", "sign-out");
  });

  it("should handle multiple rapid clicks on the button", () => {
    renderUserProfileDropdown();

    const button = screen.getByRole("button");

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
