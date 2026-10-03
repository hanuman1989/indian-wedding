"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useRef, useState } from "react";
import ActionDropdown from "@/components/common/ActionDropdown";

export default function UserTable({
  users = [],
  isLoading = false,
  handleDelete,
  onStatusChange,
}) {
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [statusError, setStatusError] = useState("");
  const statusRequestPending = useRef(false);

  const toggleStatus = async (user, isActive) => {
    if (statusRequestPending.current || !onStatusChange) return;
    if (!window.confirm(`Are you sure you want to ${isActive ? "deactivate" : "activate"} ${user.name || "this user"}?`)) return;

    statusRequestPending.current = true;
    setUpdatingUserId(user.id);
    setStatusError("");
    try {
      await onStatusChange(user.id, !isActive);
    } catch (error) {
      setStatusError(error?.message || "Unable to update user status. Please try again.");
    } finally {
      statusRequestPending.current = false;
      setUpdatingUserId(null);
    }
  };

  return (
    <div
      className="min-w-0 w-full max-w-full overflow-x-auto rounded-2xl"
      role="region"
      aria-label="Users table"
      tabIndex={0}
    >
        {statusError && (
          <p role="alert" className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {statusError}
          </p>
        )}
        {isLoading ? (
          <TableSkeleton columns={10} rows={5} />
        ) : (
          <Table className="w-full border-collapse text-left">
            <TableHeader className="border-y border-gray-100 bg-gray-50/70 dark:border-gray-800 dark:bg-white/[0.02]">
              <TableRow>
                {[
                  "User Name",
                  "Email",
                  "Phone",
                  "User Type",
                  "Status",
                  "Joined On",
                  "Actions",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    isHeader
                    className="whitespace-nowrap px-4 py-3 text-start text-xs font-semibold text-gray-500 dark:text-gray-400"
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.length > 0 ? (
                users.map((user, index) => {
                  const name = user.name?.trim() || "—";
                  const isActive = [true, 1, "1", "true", "active"].includes(typeof user.status === "string" ? user.status.toLowerCase() : user.status);
                  const isHost = [true, 1, "1", "true", "host"].includes(typeof user.is_host === "string" ? user.is_host.toLowerCase() : user.is_host);
                  const joinedOn = user.created_at;
                  return (
                    <TableRow
                      key={user.id || index}
                      className="transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                    >
                      <TableCell className="whitespace-nowrap px-4 py-1.5 text-sm font-medium text-slate-900 dark:text-white/90">
                          {name}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4 py-1.5 text-sm text-slate-500 dark:text-gray-400">
                        {user.email || "—"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4 py-1.5 text-sm text-slate-500 dark:text-gray-400">
                        {user.phone || "—"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4 py-1.5">
                        <span className={`inline-flex min-w-14 justify-center rounded-full px-4 py-1 text-xs ${isHost ? "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400" : "bg-sky-100 text-blue-500 dark:bg-sky-500/15 dark:text-sky-400"}`}>
                          {user.user_type || "—"}
                        </span>
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4 py-1.5">
                        <div className={`flex items-center gap-4 text-sm ${isActive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isActive}
                            aria-label={`Active status for ${name}`}
                            aria-busy={updatingUserId === user.id}
                            disabled={updatingUserId !== null || !onStatusChange || user.id == null}
                            onClick={() => toggleStatus(user, isActive)}
                            className={`inline-flex h-6 w-10 shrink-0 items-center rounded-full p-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${isActive ? "justify-end bg-green-600" : "justify-start bg-gray-400/70"}`}
                          >
                            <span className="h-[18px] w-[18px] rounded-full bg-white shadow-sm" />
                          </button>
                          {updatingUserId === user.id ? "Updating…" : isActive ? "Active" : "Inactive"}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4 py-1.5 text-sm text-slate-500 dark:text-gray-400">
                        {joinedOn}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4 py-1.5 text-center">
                        <ActionDropdown
                        onDelete={() => handleDelete(user.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No users found.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
    </div>
  );
}
