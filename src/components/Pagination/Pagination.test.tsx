import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it("should display current page and total pages in the format 'current / total'", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("3 / 10")).toBeInTheDocument();
  });

  it("should call onPageChange with previous page number when previous button is clicked", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText("◀");
    fireEvent.click(previousButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("should call onPageChange with next page number when next button is clicked", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText("▶");
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it("should disable previous button when current page is the first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText("◀");
    expect(previousButton).toBeDisabled();
  });

  it("should disable next button when current page is the last page", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText("▶");
    expect(nextButton).toBeDisabled();
  });

  it("should enable both navigation buttons when current page is in the middle", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText("◀");
    const nextButton = screen.getByText("▶");

    expect(previousButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it("should not trigger onPageChange callback when clicking disabled previous button", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText("◀");
    fireEvent.click(previousButton);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it("should not trigger onPageChange callback when clicking disabled next button", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText("▶");
    fireEvent.click(nextButton);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it("should handle single page scenario by disabling both navigation buttons", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("1 / 1")).toBeInTheDocument();

    const previousButton = screen.getByText("◀");
    const nextButton = screen.getByText("▶");

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it("should render with the correct container CSS class", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(container.firstChild).toHaveClass("container");
  });
});
