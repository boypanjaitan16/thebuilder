import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithMemoryRouter } from "../../test/test-utils";
import ApplyPage from "../ApplyPage";

const createAdvisoryRequest = vi.fn();

vi.mock("../../hooks/useCreateAdvisoryRequest", () => ({
	useCreateAdvisoryRequest: () => ({ createAdvisoryRequest }),
}));

describe("ApplyPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.localStorage.getItem = vi.fn().mockReturnValue(null);
	});

	it("shows required errors on empty submit", async () => {
		const user = userEvent.setup();
		renderWithMemoryRouter(<ApplyPage />, ["/apply"]);

		await user.click(screen.getByRole("button", { name: "Kirim Aplikasi" }));

		expect((await screen.findAllByText("Required")).length).toBeGreaterThan(0);
		expect(createAdvisoryRequest).not.toHaveBeenCalled();
	});

	it("limits situation selection to two", async () => {
		const user = userEvent.setup();
		renderWithMemoryRouter(<ApplyPage />, ["/apply"]);

		await user.click(
			screen.getByRole("checkbox", {
				name: "Transisi kepemimpinan atau suksesi",
			}),
		);
		await user.click(
			screen.getByRole("checkbox", {
				name: "Pertumbuhan cepat atau tekanan struktural",
			}),
		);

		expect(
			screen.getByRole("checkbox", {
				name: "Ketergantungan pada individu kunci",
			}),
		).toBeDisabled();
	});

	it("submits valid values and shows success", async () => {
		createAdvisoryRequest.mockResolvedValue({});
		const user = userEvent.setup();
		renderWithMemoryRouter(<ApplyPage />, ["/apply"]);

		await user.type(screen.getByLabelText("Nama Lengkap"), "Jane Doe");
		await user.type(screen.getByLabelText("Alamat Email"), "jane@example.com");
		await user.type(screen.getByLabelText("Peran / Jabatan"), "CEO");
		await user.type(screen.getByLabelText("Nama Organisasi"), "Acme");
		await user.selectOptions(
			screen.getByLabelText("Ukuran Organisasi"),
			"50–200 karyawan",
		);
		await user.type(screen.getByLabelText("Industri / Sektor"), "Retail");
		await user.selectOptions(
			screen.getByLabelText(
				"Pernyataan mana yang paling sesuai dengan ekspektasi Anda?",
			),
			"Kami ingin perspektif eksternal tentang risiko sistemik",
		);
		await user.type(
			screen.getByLabelText("Bagaimana biasanya keputusan strategis dibuat?"),
			"Founder-led",
		);
		await user.click(
			screen.getByRole("radio", {
				name: "Kami memahami rentang ini dan siap mengeksplorasi kecocokan",
			}),
		);
		await user.click(screen.getByRole("radio", { name: "Dalam 1–3 bulan" }));

		await user.click(screen.getByRole("button", { name: "Kirim Aplikasi" }));

		await waitFor(() => expect(createAdvisoryRequest).toHaveBeenCalledTimes(1));
		expect(createAdvisoryRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "Jane Doe",
				email: "jane@example.com",
				size: "50–200 karyawan",
				timeline: "Dalam 1–3 bulan",
			}),
		);
		expect(await screen.findByRole("status")).toHaveTextContent(
			"Aplikasi Anda telah diterima.",
		);
	});
});
