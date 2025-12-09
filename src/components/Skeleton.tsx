const Skeleton = () => {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-8 space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-8 bg-slate-200 rounded w-48"></div>
                </div>
                <div className="h-10 w-32 bg-slate-200 rounded-full"></div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="h-6 bg-slate-200 rounded w-64"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>

                <div className="h-32 bg-slate-100 rounded-xl w-full"></div>
            </div>
        </div>
    );
};

export default Skeleton;

