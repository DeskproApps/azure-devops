import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../../../testing";
import { Navigation } from "../Navigation";
import type { Props } from "../Navigation";

const renderNavigation = (props?: Partial<Props>) => render((
  <Navigation
    onNavigateToLink={props?.onNavigateToLink}
    onNavigateToCreate={props?.onNavigateToCreate}
  />
), { wrappers: { theme: true } });

describe("Navigation", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByRole } = renderNavigation();
    const findButton = await findByRole("button", { name: /Find Item/i });
    const createButton = await findByRole("button", { name: /Create Item/i });

    expect(findButton).toBeInTheDocument();
    expect(createButton).toBeInTheDocument();
  });

  test("should navigate to create work item", async () => {
    const mockOnNavigateToCreate = jest.fn();
    const { findByRole } = renderNavigation({ onNavigateToCreate: mockOnNavigateToCreate });
    const createButton = await findByRole("button", { name: /Create Item/i });

    await userEvent.click(createButton as Element);

    expect(mockOnNavigateToCreate).toHaveBeenCalled();
  });

  test("should navigate to find work items", async () => {
    const mockOnNavigateToLink = jest.fn();
    const { findByRole } = renderNavigation({ onNavigateToLink: mockOnNavigateToLink });
    const findButton = await findByRole("button", { name: /Find Item/i });

    await userEvent.click(findButton as Element);

    expect(mockOnNavigateToLink).toHaveBeenCalled();
  });
});
