export class Skeleton extends React.Component {
    render() {
        return (
            <div className="space-y-4">
                {[...Array(1)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow animate-pulse">
                        <div className="flex justify-between">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="mt-3 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="mt-3 flex space-x-4">
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}