import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Blog from "./Blog";
import NewBlog from "./NewBlog";

const blog = {
  id: "1",
  title: "Test Blog",
  author: "John Doe",
  url: "http://test.com",
  likes: 10,
  user: {
    id: "2",
    name: "Jane Doe",
  },
};

describe("Blog component", () => {
  test("renders blog title and author, but not URL or likes by default", () => {
    render(<Blog blog={blog} handleLike={() => {}} handleRemove={() => {}} />);
    expect(screen.getByText(/test blog - john doe/i)).toBeInTheDocument();
    expect(screen.queryByText("http://test.com")).not.toBeInTheDocument();
    expect(screen.queryByText("Likes: 10")).not.toBeInTheDocument();
  });

  test("shows URL and likes when the toggle button is clicked", () => {
    render(<Blog blog={blog} handleLike={() => {}} handleRemove={() => {}} />);
    fireEvent.click(screen.getByText(/view/i));
    expect(screen.getByText("http://test.com")).toBeInTheDocument();
    expect(screen.getByText("Likes: 10")).toBeInTheDocument();
  });

  test("like button calls event handler twice when clicked twice", () => {
    const handleLike = vi.fn();
    render(
      <Blog blog={blog} handleLike={handleLike} handleRemove={() => {}} />
    );
    fireEvent.click(screen.getByText(/view/i));

    const likeButton = screen.getByRole("button", { name: /like/i });
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(handleLike).toHaveBeenCalledTimes(2);
  });
});

describe("NewBlog component", () => {
  it("calls createNewBlog with the correct details when the form is submitted", async () => {
    const mockCreateNewBlog = vi.fn();
    render(
      <NewBlog
        createNewBlog={mockCreateNewBlog}
        setShowNewBlogForm={() => {}}
        showNewBlogForm={true}
      />
    );

    await waitFor(() => screen.getByLabelText(/title/i));
    await waitFor(() => screen.getByLabelText(/author/i));
    await waitFor(() => screen.getByLabelText(/url/i));

    const titleInput = screen.getByLabelText(/title/i);
    const authorInput = screen.getByLabelText(/author/i);
    const urlInput = screen.getByLabelText(/url/i);

    const submitButton = screen.getByRole("button", {
      name: /create/i,
    });

    // Simulate user typing in the inputs
    await userEvent.type(titleInput, "Test Blog Title");
    await userEvent.type(authorInput, "John Doe");
    await userEvent.type(urlInput, "http://example.com");

    // Check if the state is updated with the correct values
    expect(titleInput).toHaveValue("Test Blog Title");
    expect(authorInput).toHaveValue("John Doe");
    expect(urlInput).toHaveValue("http://example.com");

    // Submit the form
    await userEvent.click(submitButton);

    // Assert that createNewBlog was called with the correct data
    expect(mockCreateNewBlog).toHaveBeenCalledWith({
      title: "Test Blog Title",
      author: "John Doe",
      url: "http://example.com",
      likes: 0,
    });
  });
});
