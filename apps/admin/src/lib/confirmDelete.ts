import { Modal } from "antd";

type ConfirmDeleteOptions = {
	title: string;
	content?: string;
	onConfirm: () => void | Promise<void>;
};

export function confirmDelete({
	title,
	content,
	onConfirm,
}: ConfirmDeleteOptions) {
	Modal.confirm({
		title,
		content,
		centered: true,
		okText: "Delete",
		okType: "danger",
		cancelText: "Cancel",
		onOk: onConfirm,
	});
}
