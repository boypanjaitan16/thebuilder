import type { TableProps } from "antd";
import { Alert, Button, Space, Table } from "antd";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { AdminBreadcrumb } from "../../components/AdminBreadcrumb";
import { AdvisoryRequestDrawer } from "../../components/AdvisoryRequestDrawer";
import { useToast } from "../../components/ToastProvider";
import { useDeleteAdvisoryRequest } from "../../hooks/useDeleteAdvisoryRequest";
import { useGetAdvisoryRequests } from "../../hooks/useGetAdvisoryRequests";
import { confirmDelete } from "../../lib/confirmDelete";
import { formatDate } from "../../lib/date";
import { toErrorMessage } from "../../lib/errors";
import type { AdvisoryRequest } from "../../types/AdvisoryRequest";

function AdvisoryRequestsPage() {
	const { showToast } = useToast();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [viewingRequest, setViewingRequest] = useState<AdvisoryRequest | null>(
		null,
	);
	const [actionError, setActionError] = useState<string | null>(null);

	const {
		data: requests,
		isLoading: loading,
		error,
	} = useGetAdvisoryRequests();
	const { deleteAdvisoryRequest } = useDeleteAdvisoryRequest();

	const combinedError = error || actionError;

	const handleDelete = async (record: AdvisoryRequest) => {
		setActionError(null);
		try {
			await deleteAdvisoryRequest(record.id);
			showToast("Advisory request deleted", { tone: "success" });
		} catch (err) {
			setActionError(toErrorMessage(err, "Failed to delete advisory request."));
		}
	};

	const columns: TableProps<AdvisoryRequest>["columns"] = [
		{ title: "Name", dataIndex: "name", key: "name" },
		{ title: "Organization", dataIndex: "organization", key: "organization" },
		{ title: "Email", dataIndex: "email", key: "email" },
		{
			title: "Submitted",
			dataIndex: "created_at",
			key: "created_at",
			width: 150,
			render: (value: string) => formatDate(value),
		},
		{
			title: "Actions",
			key: "actions",
			width: 170,
			render: (_, record) => (
				<Space>
					<Button
						icon={<Eye size={14} />}
						onClick={() => {
							setViewingRequest(record);
							setDrawerOpen(true);
						}}
					>
						View
					</Button>
					<Button
						danger
						icon={<Trash2 size={14} />}
						onClick={() =>
							confirmDelete({
								title: `Delete request from "${record.name}"?`,
								content: "This action cannot be undone.",
								onConfirm: () => handleDelete(record),
							})
						}
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<section className="container-page w-full">
			<AdminBreadcrumb items={[{ label: "Advisory Requests" }]} />
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-2xl font-semibold text-ink">Advisory Requests</h2>
					<p className="text-sm text-slate-600">
						Requests submitted via the public Apply form.
					</p>
				</div>
			</div>
			{combinedError && <Alert type="error" showIcon title={combinedError} />}
			<Table<AdvisoryRequest>
				columns={columns}
				dataSource={requests}
				rowKey="id"
				loading={loading}
				pagination={false}
				locale={{ emptyText: "No advisory requests yet." }}
				className="mt-5"
				scroll={{ x: "max-content" }}
			/>
			<AdvisoryRequestDrawer
				open={drawerOpen}
				advisoryRequest={viewingRequest}
				onClose={() => setDrawerOpen(false)}
			/>
		</section>
	);
}

export default AdvisoryRequestsPage;
