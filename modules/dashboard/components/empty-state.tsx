import React from "react";
import Image from "next/image";

const EmptyState = () => {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <Image
        src="/empty-state.svg"
        alt="No Projects Found"
        width={192}
        height={192}
        className="mb-4 w-48 h-48"
      />
      <h2 className="text-xl font-semibold text-gray-500">No Projects Found</h2>
        <p className="text-gray-400">Create a new project to get started!</p>
    </div>
  );
};

export default EmptyState;
