import privateAxios from "@/lib/privateAxios";
import type { IBackendPaginatedResponse } from "@/types/backend.type";
import type {
  IUserSubmission,
  ISubmissionStats,
  ISubmissionListParams,
  IApproveSubmissionDto,
  IRejectSubmissionDto,
  IUpdateSubmissionStatusDto,
} from "@/types/submission.type";

/* Helper shape for single-item responses from this API */
interface SubmissionApiResponse<T> {
  metadata?: { EC: number; EM: string };
  data: {
    EC: number;
    EM: string;
    result: T;
  };
}

export const submissionService = {
  /* ── Admin: List all ─────────────────────────────────────────────── */
  getAll: async (
    params: ISubmissionListParams = {}
  ): Promise<IBackendPaginatedResponse<IUserSubmission>> => {
    const res = await privateAxios.get<
      IBackendPaginatedResponse<IUserSubmission>
    >("/user-submissions/admin/all", { params: { current: 1, pageSize: 10, ...params } });
    return res as unknown as IBackendPaginatedResponse<IUserSubmission>;
  },

  /* ── Admin: Stats ────────────────────────────────────────────────── */
  getStats: async (): Promise<SubmissionApiResponse<ISubmissionStats>> => {
    const res = await privateAxios.get<SubmissionApiResponse<ISubmissionStats>>(
      "/user-submissions/admin/stats"
    );
    return res as unknown as SubmissionApiResponse<ISubmissionStats>;
  },

  /* ── Admin: Detail ───────────────────────────────────────────────── */
  getById: async (
    id: number
  ): Promise<SubmissionApiResponse<IUserSubmission>> => {
    const res = await privateAxios.get<SubmissionApiResponse<IUserSubmission>>(
      `/user-submissions/admin/${id}`
    );
    return res as unknown as SubmissionApiResponse<IUserSubmission>;
  },

  /* ── Admin: Approve ──────────────────────────────────────────────── */
  approve: async (
    id: number,
    dto: IApproveSubmissionDto = {}
  ): Promise<SubmissionApiResponse<IUserSubmission>> => {
    const res = await privateAxios.post<SubmissionApiResponse<IUserSubmission>>(
      `/user-submissions/admin/${id}/approve`,
      dto
    );
    return res as unknown as SubmissionApiResponse<IUserSubmission>;
  },

  /* ── Admin: Reject ───────────────────────────────────────────────── */
  reject: async (
    id: number,
    dto: IRejectSubmissionDto
  ): Promise<SubmissionApiResponse<IUserSubmission>> => {
    const res = await privateAxios.post<SubmissionApiResponse<IUserSubmission>>(
      `/user-submissions/admin/${id}/reject`,
      dto
    );
    return res as unknown as SubmissionApiResponse<IUserSubmission>;
  },

  /* ── Admin: Update status manually ──────────────────────────────── */
  updateStatus: async (
    id: number,
    dto: IUpdateSubmissionStatusDto
  ): Promise<SubmissionApiResponse<IUserSubmission>> => {
    const res = await privateAxios.patch<SubmissionApiResponse<IUserSubmission>>(
      `/user-submissions/admin/${id}/status`,
      dto
    );
    return res as unknown as SubmissionApiResponse<IUserSubmission>;
  },
};
