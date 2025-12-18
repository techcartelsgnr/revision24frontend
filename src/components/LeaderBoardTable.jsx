// import React, { useState } from "react";
// import DataTable from "react-data-table-component";
// import { FaUser } from "react-icons/fa";

// const LeaderBoardTable = ({ data, rankScore }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [rowsPerPage, setRowsPerPage] = useState(10);

//     console.log("data", data)

//     const columns = [
//         {
//             name: "Sr. No.",
//             cell: (row, index) =>
//                 (currentPage - 1) * rowsPerPage + index + 1,
//             width: "90px",
//             sortable: false,
//         },
//         {
//             name: "Rank",
//             cell: row => (
//                 <div className="flex items-center justify-center font-bold text-center bg-amber-200 w-8 h-8 rounded-full">
//                     {row.rank}
//                 </div>
//             ),
//             sortable: true,
//             width: "100px",
//         },
//         {
//             name: "User",
//             cell: row => (
//                 <div className="flex items-center gap-2">
//                     {
//                         row.user_image ? (
//                             <img
//                                 src={row.user_image}
//                                 alt={row.user_name}
//                                 className="w-8 h-8 rounded-full object-cover"
//                             />
//                         ) :
//                             <FaUser />
//                     }

//                     <span>{row.user_name}</span>
//                 </div>
//             ),
//             sortable: true,
//         },
//         {
//             name: "Score",
//             selector: row => rankScore,
//             sortable: true,

//         },
//     ];

//     return (
//         <div className="p-4 bg-white rounded shadow-md">
//             <h2 className="text-xl font-semibold mb-4">🏆 Leaderboard</h2>
//             <DataTable
//                 columns={columns}
//                 data={data}
//                 pagination
//                 paginationPerPage={rowsPerPage}
//                 onChangePage={page => setCurrentPage(page)}
//                 onChangeRowsPerPage={(newPerPage, page) => {
//                     setRowsPerPage(newPerPage);
//                     setCurrentPage(page);
//                 }}
//                 responsive
//                 highlightOnHover
//                 striped
//                 dense
//                 customStyles={{
//                     rows: {
//                         style: {
//                             paddingTop: '12px',
//                             paddingBottom: '12px',
//                             textAlign: 'center',
//                         },
//                     },
//                     headCells: {
//                         style: {
//                             fontSize: "14px",
//                             fontWeight: "600",
//                             textAlign: 'center',
//                         },
//                     },
//                     cells: {
//                         style: {
//                             paddingLeft: "16px",
//                             paddingRight: "16px",
//                             textAlign: 'start',
//                         },
//                     },
//                 }}
//             />
//         </div>
//     );
// };

// export default LeaderBoardTable;


import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { FaUser } from "react-icons/fa";

const LeaderBoardTable = ({ data, rankScore }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    console.log("Leaderboard data:", data);
    console.log("User's rankScore:", rankScore);

    const columns = [
        {
            name: "Sr. No.",
            cell: (row, index) =>
                (currentPage - 1) * rowsPerPage + index + 1,
            width: "90px",
            sortable: false,
        },
        {
            name: "Rank",
            cell: row => (
                <div className={`
                    flex items-center justify-center font-bold text-center w-10 h-10 rounded-full
                    ${row.rank === 1 ? 'bg-yellow-400 text-yellow-900' : 
                      row.rank === 2 ? 'bg-gray-300 text-gray-800' : 
                      row.rank === 3 ? 'bg-orange-400 text-orange-900' : 
                      'bg-blue-100 text-blue-700'}
                `}>
                    {row.rank}
                </div>
            ),
            sortable: true,
            width: "100px",
        },
        {
            name: "User",
            cell: row => {
                // ✅ Check if this is the current user
                const isCurrentUser = rankScore !== null && 
                    Math.abs(row.marks - rankScore) < 0.01;

                return (
                    <div className="flex items-center gap-2">
                        {row.user_image ? (
                            <img
                                src={row.user_image}
                                alt={row.user_name}
                                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <FaUser className="text-gray-500" />
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{row.user_name}</span>
                                {isCurrentUser && (
                                    <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full font-semibold">
                                        You
                                    </span>
                                )}
                            </div>
                            {row.user_mobile && (
                                <span className="text-xs text-gray-500">{row.user_mobile}</span>
                            )}
                        </div>
                    </div>
                );
            },
            sortable: true,
            grow: 2,
        },
        {
            name: "Score",
            // ✅ FIX: Use row.marks instead of rankScore
            selector: row => row.marks,
            cell: row => (
                <div className={`
                    inline-flex items-center px-3 py-1.5 rounded-lg font-bold text-base
                    ${row.marks >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                `}>
                    {row.marks}
                </div>
            ),
            sortable: true,
            width: "120px",
        },
    ];

    // ✅ Custom row styles to highlight current user
    const conditionalRowStyles = [
        {
            when: row => rankScore !== null && Math.abs(row.marks - rankScore) < 0.01,
            style: {
                backgroundColor: '#fef3c7', // Yellow-50
                borderLeft: '4px solid #eab308', // Yellow-500
                fontWeight: '600',
            },
        },
    ];

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                🏆 Leaderboard
            </h2>
            <DataTable
                columns={columns}
                data={data}
                pagination
                paginationPerPage={rowsPerPage}
                onChangePage={page => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage, page) => {
                    setRowsPerPage(newPerPage);
                    setCurrentPage(page);
                }}
                responsive
                highlightOnHover
                striped
                dense
                conditionalRowStyles={conditionalRowStyles}
                customStyles={{
                    rows: {
                        style: {
                            paddingTop: '12px',
                            paddingBottom: '12px',
                        },
                    },
                    headCells: {
                        style: {
                            fontSize: "14px",
                            fontWeight: "700",
                            textAlign: 'center',
                            backgroundColor: '#f9fafb',
                            color: '#374151',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        },
                    },
                    cells: {
                        style: {
                            paddingLeft: "16px",
                            paddingRight: "16px",
                        },
                    },
                }}
            />
        </div>
    );
};

export default LeaderBoardTable;
