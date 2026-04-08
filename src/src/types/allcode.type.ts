/** GET /allcodes, GET /allcodes/admin — bảng AllCode */
export interface IAllCode {
  id: number;
  keyMap: string;
  type: string;
  value: string;
  description: string | null;
  createdAt: string;
  updatedAt?: string;
}

/** POST /allcodes — CreateAllcodeDto */
export interface ICreateAllCodeRequest {
  keyMap: string;
  type: string;
  value: string;
  description?: string;
}

/** PATCH /allcodes/:id — UpdateAllcodeDto (partial) */
export interface IUpdateAllCodeRequest {
  keyMap?: string;
  type?: string;
  value?: string;
  description?: string | null;
}
