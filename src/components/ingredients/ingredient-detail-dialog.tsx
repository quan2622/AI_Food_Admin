"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Info, Droplets, Zap } from "lucide-react";
import { ingredientService } from "@/services/ingredientService";
import type { IIngredient } from "@/types/ingredient.type";
import { toast } from "sonner";

interface IngredientDetailDialogProps {
  id: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IngredientDetailDialog({
  id,
  open,
  onOpenChange,
}: IngredientDetailDialogProps) {
  const [data, setData] = useState<IIngredient | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && id) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const res = await ingredientService.getIngredientById(id);
          if (res.metadata.EC === 0) {
            setData(res.data);
          } else {
            toast.error(res.metadata.message || "Không thể lấy thông tin chi tiết");
          }
        } catch (error) {
          toast.error("Lỗi khi kết nối đến máy chủ");
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    } else {
      setData(null);
    }
  }, [open, id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-500" />
            Chi tiết nguyên liệu
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : data ? (
          <ScrollArea className="flex-1 p-6 pt-2">
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="flex flex-col md:flex-row gap-6">
                {data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt={data.ingredientName}
                    className="w-full md:w-48 h-48 object-cover rounded-2xl shadow-sm border border-slate-100"
                  />
                ) : (
                  <div className="w-full md:w-48 h-48 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                    Không có ảnh
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <h3 className="text-3xl font-extrabold text-slate-900 leading-tight">
                    {data.ingredientName}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 text-xs font-bold rounded-full">
                      ID: #{data.id}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic text-[15px]">
                    {data.description || "Chưa có mô tả cho nguyên liệu này."}
                  </p>
                </div>
              </div>


              {/* Nutritions Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Droplets className="w-5 h-5 text-emerald-500" />
                  <h4 className="text-lg font-bold text-slate-800">Thành phần dinh dưỡng</h4>
                </div>
                {data.ingredientNutritions && data.ingredientNutritions.length > 0 ? (
                  <div className="space-y-6">
                    {data.ingredientNutritions.map((nutri: any, idx: number) => (
                      <div key={idx} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                            Định lượng: <span className="text-slate-900">{nutri.servingSize} {nutri.servingUnit}</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {nutri.values?.map((val: any, vIdx: number) => (
                            <div key={vIdx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                              <span className="text-[11px] font-bold text-slate-400 uppercase leading-none mb-1">
                                {val.nutrient.name}
                              </span>
                              <div className="flex items-baseline gap-1 mt-auto">
                                <span className="text-lg font-black text-slate-800 leading-none">
                                  {val.value}
                                </span>
                                <span className="text-[10px] font-extrabold text-slate-400">
                                  {val.nutrient.unit}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic">Dữ liệu dinh dưỡng đang được cập nhật.</p>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="h-60 flex flex-col items-center justify-center text-slate-400">
             <Zap className="w-10 h-10 mb-2 opacity-20" />
             <p>Không có dữ liệu</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
