import React, { useEffect, useState } from 'react'

function Pagination({ data, onPageData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const record = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordsPerPage);
  const numbers = [...Array(npage).keys()].map((n)=>n+1);
  
     useEffect(() => {
       onPageData(record);
     }, [currentPage, data]);

    const changeCpage = (n) => {
      setCurrentPage(n);
  };

    const prePage = () => {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
  };

    const nextPage = () => {
      if (currentPage < npage) {
        setCurrentPage((prev) => prev + 1);
      }
  };
  return (
    <div>
      <div className="flex justify-center gap-3 mb-10 mt-5">
        <button onClick={prePage} className="border px-3 py-1 rounded cursor-pointer">
          Prev
        </button>
        {numbers.map((n) => {
          return (
            <button
              onClick={()=>changeCpage(n)}
              className={`${
                currentPage === n ? "bg-green-500 text-white" : "hover:bg-green-300 hover:text-white border"
              }  px-3 py-1 rounded cursor-pointer`}
              key={n}
            >
              {n}
            </button>
          );
        })}

        <button onClick={nextPage} className="border px-3 py-1 rounded cursor-pointer">
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination
