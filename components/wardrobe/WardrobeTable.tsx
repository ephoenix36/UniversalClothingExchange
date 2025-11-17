"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ArrowUpDown,
	MoreHorizontal,
	Eye,
	Edit2,
	Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { WardrobeItem, ItemImage } from "@prisma/client";

export type WardrobeItemWithImages = WardrobeItem & {
	images: ItemImage[];
};

interface WardrobeTableProps {
	items: WardrobeItemWithImages[];
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
	onView?: (id: string) => void;
}

export function WardrobeTable({
	items,
	onEdit,
	onDelete,
	onView,
}: WardrobeTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	const columns: ColumnDef<WardrobeItemWithImages>[] = [
		{
			accessorKey: "images",
			header: "Image",
			cell: ({ row }) => {
				const images = row.getValue("images") as ItemImage[];
				const primaryImage = images.find((img) => img.isPrimary) || images[0];
				return (
					<div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
						{primaryImage ? (
							<Image
								src={primaryImage.url}
								alt={row.original.title}
								fill
								className="object-cover"
								sizes="64px"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
								No Image
							</div>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "title",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Title
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				return (
					<div className="flex flex-col">
						<Link
							href={`/wardrobe/${row.original.id}`}
							className="font-medium hover:underline"
						>
							{row.original.title}
						</Link>
						{row.original.brand && (
							<span className="text-sm text-muted-foreground">
								{row.original.brand}
							</span>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "category",
			header: "Category",
			cell: ({ row }) => {
				return (
					<Badge variant="outline">
						{row.getValue<string>("category").replace("_", " ")}
					</Badge>
				);
			},
		},
		{
			accessorKey: "size",
			header: "Size",
			cell: ({ row }) => {
				return <div className="font-medium">{row.getValue("size")}</div>;
			},
		},
		{
			accessorKey: "condition",
			header: "Condition",
			cell: ({ row }) => {
				const condition = row.getValue<string>("condition");
				const colors: Record<string, string> = {
					NEW: "bg-green-500/10 text-green-700 dark:text-green-400",
					LIKE_NEW: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
					GOOD: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
					FAIR: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
				};
				return (
					<Badge variant="outline" className={colors[condition]}>
						{condition.replace("_", " ")}
					</Badge>
				);
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.getValue<string>("status");
				const colors: Record<string, string> = {
					AVAILABLE: "bg-green-500 text-white",
					ON_LOAN: "bg-blue-500 text-white",
					IN_TRANSIT: "bg-purple-500 text-white",
					UNAVAILABLE: "bg-gray-500 text-white",
				};
				return (
					<Badge className={colors[status]}>
						{status.replace("_", " ")}
					</Badge>
				);
			},
		},
		{
			accessorKey: "availableForSwap",
			header: "Available",
			cell: ({ row }) => {
				return row.getValue("availableForSwap") ? (
					<Badge variant="outline" className="bg-green-50">
						Swap
					</Badge>
				) : (
					<Badge variant="outline" className="bg-gray-50">
						No
					</Badge>
				);
			},
		},
		{
			accessorKey: "swapCount",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Swaps
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				return (
					<div className="text-center font-medium">
						{row.getValue("swapCount")}
					</div>
				);
			},
		},
		{
			accessorKey: "estimatedValue",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Value
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const value = row.getValue("estimatedValue") as number | null;
				return value ? (
					<div className="font-medium">${value.toFixed(2)}</div>
				) : (
					<span className="text-muted-foreground">-</span>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Added
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const date = new Date(row.getValue("createdAt"));
				return (
					<div className="text-sm text-muted-foreground">
						{date.toLocaleDateString()}
					</div>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const item = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreHorizontal className="h-4 w-4" />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuCheckboxItem
								onClick={() => onView?.(item.id)}
								className="cursor-pointer"
							>
								<Eye className="mr-2 h-4 w-4" />
								View
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								onClick={() => onEdit?.(item.id)}
								className="cursor-pointer"
							>
								<Edit2 className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								onClick={() => onDelete?.(item.id)}
								className="cursor-pointer text-destructive"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable({
		data: items,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className="space-y-4">
			{/* Toolbar */}
			<div className="flex items-center justify-between">
				<div className="flex flex-1 items-center space-x-2">
					<Input
						placeholder="Search items..."
						value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("title")?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(!!value)}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No items found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between px-2">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex items-center space-x-6 lg:space-x-8">
					<div className="flex items-center space-x-2">
						<p className="text-sm font-medium">Rows per page</p>
						<select
							value={table.getState().pagination.pageSize}
							onChange={(e) => {
								table.setPageSize(Number(e.target.value));
							}}
							className="h-8 w-[70px] rounded-md border border-input bg-background px-2"
						>
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									{pageSize}
								</option>
							))}
						</select>
					</div>
					<div className="flex w-[100px] items-center justify-center text-sm font-medium">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeft className="h-4 w-4" />
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
