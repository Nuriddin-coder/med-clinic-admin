import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/common/Card';
import { Skeleton } from '@/components/ui/skeleton';

/* =========================================================================
   Pagination Skeleton
   ========================================================================= */
export const PaginationSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border-t border-slate-100">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-7 w-28 hidden sm:block rounded-lg" />
      </div>
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg hidden sm:block" />
        <div className="flex items-center gap-1 mx-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg hidden sm:block" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
};

/* =========================================================================
   Appointments Table Skeleton
   ========================================================================= */
export const AppointmentsTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => {
  return (
    <Card className="shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Qabul Sanasi & Vaqti</th>
              <th className="px-5 py-3.5">Bemor</th>
              <th className="px-5 py-3.5">Shifokor & Xizmat</th>
              <th className="px-5 py-3.5">Izoh</th>
              <th className="px-5 py-3.5 w-44">Holati</th>
              <th className="px-5 py-3.5 text-right">Amal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, idx) => (
              <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-28 mb-1.5" />
                  <Skeleton className="h-3 w-16" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-28 mb-1.5" />
                  <Skeleton className="h-3 w-24" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-32 mb-1.5" />
                  <Skeleton className="h-3 w-36" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-3.5 w-40" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-8 w-32 rounded-xl" />
                </td>
                <td className="px-5 py-4 text-right">
                  <Skeleton className="h-7 w-7 rounded-lg ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationSkeleton />
    </Card>
  );
};

/* =========================================================================
   Doctors Table Skeleton
   ========================================================================= */
export const DoctorsTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => {
  return (
    <Card className="shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Shifokor</th>
              <th className="px-5 py-3.5">Mutaxassislik & Unvon</th>
              <th className="px-5 py-3.5">Narxi & Tajriba</th>
              <th className="px-5 py-3.5">Ta'lim & Tillari</th>
              <th className="px-5 py-3.5 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, idx) => (
              <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1.5" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-5 w-24 rounded-md mb-1.5" />
                  <Skeleton className="h-3 w-36" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-24 mb-1.5" />
                  <Skeleton className="h-3 w-20" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-3.5 w-40 mb-1.5" />
                  <Skeleton className="h-3 w-24" />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Skeleton className="h-7 w-7 rounded-lg" />
                    <Skeleton className="h-7 w-7 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationSkeleton />
    </Card>
  );
};

/* =========================================================================
   Services Table Skeleton
   ========================================================================= */
export const ServicesTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => {
  return (
    <Card className="shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Xizmat Nomi</th>
              <th className="px-5 py-3.5">Soha / Mutaxassislik</th>
              <th className="px-5 py-3.5">Davomiyligi</th>
              <th className="px-5 py-3.5">Narxi</th>
              <th className="px-5 py-3.5 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, idx) => (
              <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-44 mb-1.5" />
                  <Skeleton className="h-3 w-72" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-5 w-24 rounded-full" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-6 w-20 rounded-md" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Skeleton className="h-7 w-7 rounded-lg" />
                    <Skeleton className="h-7 w-7 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationSkeleton />
    </Card>
  );
};

/* =========================================================================
   Contact Table Skeleton
   ========================================================================= */
export const ContactTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => {
  return (
    <Card className="shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3.5">F.I.Sh & Vaqti</th>
              <th className="px-5 py-3.5">Telefon & Email</th>
              <th className="px-5 py-3.5">Xabar matni</th>
              <th className="px-5 py-3.5 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, idx) => (
              <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-32 mb-1.5" />
                  <Skeleton className="h-3 w-24" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-3.5 w-28 mb-1.5" />
                  <Skeleton className="h-3 w-36" />
                </td>
                <td className="px-5 py-4 max-w-md">
                  <Skeleton className="h-3.5 w-full mb-1" />
                  <Skeleton className="h-3 w-4/5" />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-16 rounded-lg" />
                    <Skeleton className="h-7 w-7 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationSkeleton />
    </Card>
  );
};

/* =========================================================================
   Specialties Grid Skeleton
   ========================================================================= */
export const SpecialtiesGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, idx) => (
          <Card key={idx} className="shadow-2xs flex flex-col justify-between">
            <CardBody className="p-5">
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex items-center gap-1.5">
                  <Skeleton className="w-7 h-7 rounded-lg" />
                  <Skeleton className="w-7 h-7 rounded-lg" />
                </div>
              </div>
              <Skeleton className="h-5 w-32 mt-3 mb-2" />
              <Skeleton className="h-3.5 w-full mb-1.5" />
              <Skeleton className="h-3.5 w-4/5" />
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-14" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
        <PaginationSkeleton />
      </div>
    </div>
  );
};

/* =========================================================================
   Dashboard Skeleton
   ========================================================================= */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-7 w-72 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="shadow-2xs">
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="w-10 h-10 rounded-xl" />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Main Grid: Appointments & Doctors Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Qabullar Ro'yxati"
              subtitle="Haqiqiy backenddan olingan so'nggi yozuvlar"
            />
            <div className="p-5 space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-md hidden sm:block" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Shifokorlar" subtitle="Mutaxassislar" />
            <CardBody className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

