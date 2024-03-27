import { render, screen, fireEvent } from "@testing-library/react";
import MovieDetails from "./App";

describe("MovieDetails component", () => {
  const mockSelectedID = "tt1234567";
  const mockOnClosebtn = jest.fn();
  const mockOnAddMovie = jest.fn();
  const mockWatched = [];

  beforeEach(() => {
    render(
      <MovieDetails
        selectedID={mockSelectedID}
        onClosebtn={mockOnClosebtn}
        onAddMovie={mockOnAddMovie}
        watched={mockWatched}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders movie details correctly", () => {
    // Check if movie title is rendered
    expect(screen.getByText("Movie Title")).toBeInTheDocument();

    // Check if movie poster is rendered
    expect(
      screen.getByAltText("Poster of Movie Title movie")
    ).toBeInTheDocument();

    // Check if movie details are rendered
    expect(screen.getByText("Released Date")).toBeInTheDocument();
    expect(screen.getByText("Runtime")).toBeInTheDocument();
    expect(screen.getByText("Genre")).toBeInTheDocument();
    expect(screen.getByText("IMDB Rating")).toBeInTheDocument();
  });

  it("handles adding movie to watched list", () => {
    // Simulate user rating
    fireEvent.click(screen.getByLabelText("5"));

    // Simulate click on "Add To List" button
    fireEvent.click(screen.getByText("+ Add To List"));

    // Check if onAddMovie function is called with correct arguments
    expect(mockOnAddMovie).toHaveBeenCalledWith({
      imdbID: mockSelectedID,
      poster: "movie-poster-url",
      title: "Movie Title",
      runtime: 120,
      imdbRating: "7.5",
      userRating: 5,
    });

    // Check if onClosebtn function is called
    expect(mockOnClosebtn).toHaveBeenCalled();
  });

  it("displays user rating if movie is already in watched list", () => {
    const mockWatched = [
      {
        imdbID: "tt1234567",
        userRating: 8,
      },
    ];

    render(
      <MovieDetails
        selectedID={mockSelectedID}
        onClosebtn={mockOnClosebtn}
        onAddMovie={mockOnAddMovie}
        watched={mockWatched}
      />
    );

    // Check if user rating is displayed
    expect(screen.getByText("You rated movie 8")).toBeInTheDocument();
  });
});
