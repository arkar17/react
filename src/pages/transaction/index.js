import React,{useState,useEffect, useMemo} from 'react'
import Header from '../../components/header'
import Navbar from '../../components/navbar'
import "./styles.css"

import * as XLSX from 'xlsx/xlsx.mjs';
import { useTable } from 'react-table'
import {Navigate} from "react-router-dom"

import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { axiosInstance } from '../../urlConfig';
import { useSelector } from 'react-redux';

function Table({columns, data, id}){

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({columns,data: data? data : []})

  return (
    <table id = {id} {...getTableProps()} className='sale-details-parent-container'>
      <thead>
        {
          headerGroups?.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className = "sale-details-labels-container">
                {
                  headerGroup.headers?.map( column => (
                    <th {...column.getHeaderProps()}>
                      {
                        column.render('Header')
                      }
                    </th>
                  ))
                }
              </tr>
          ))
        }
      </thead>
      <tbody {...getTableBodyProps()} className="sale-details-rows-container">
        { // loop over the rows
          rows?.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className='sale-details-row'>
                { // loop over the rows cells 
                  row.cells?.map(cell => (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))
                }
              </tr> 
            )
          })
        }
        {/* <tr>
          <td></td>
        </tr> */}
      </tbody>
    </table>
  );
}
function SaleBookTable({columns, data, id}){

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({columns,data: data? data : []})

  return (
    <table id = {id} {...getTableProps()} className='sale-details-parent-container'>
      <thead>
        {
          headerGroups?.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className = "sale-details-labels-container">
                {
                  headerGroup.headers?.map( column => (
                    <th {...column.getHeaderProps()}>
                      {
                        column.render('Header')
                      }
                    </th>
                  ))
                }
              </tr>
          ))
        }
      </thead>
      <tbody {...getTableBodyProps()} className="sale-details-rows-container">
        { // loop over the rows
          rows?.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className='sale-details-row'>
                { // loop over the rows cells 
                  row.cells?.map(cell => (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))
                }
              </tr> 
            )
          })
        }
        {/* <tr>
          <td></td>
        </tr> */}
      </tbody>
    </table>
  );
}

const handleExcelExport = (data,title) => {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)

  XLSX.utils.book_append_sheet(wb,ws, title)

  XLSX.writeFile(wb, `${title}.xlsx`)
}

const handlePdfExport = (title,id) => {
  const doc = new jsPDF()
  doc.text(title,20,10,)
  autoTable(doc, { html: id })
  doc.save(`${title}.pdf`)
}



const Transaction = () => {

    const [headerCategory,setHeaderCategory] = useState("2d")
    const [transactionCategory,setTransactionCategory] = useState("sale day book")

    const [is2dGenerateOpen,setIs2dGenerateOpen] = useState(false)
    const [isLonePyineGenerateOpen,setIsLonePyineGenerateOpen] = useState(false)
    const [is3dGenerateOpen,setIs3dGenerateOpen] = useState(false)

    const [is2dSaleBookGenerateOpen,setIs2dSaleBookGenerateOpen] = useState(false)
    const [isLonePyineSaleBookGenerateOpen,setIsLonePyineSaleBookGenerateOpen] = useState(false)
    const [is3dSaleBookGenerateOpen,setIs3dSaleBookGenerateOpen] = useState(false)

    const [twodWinners,setTwodWinners] = useState([])
    const [lonePyineWinners,setLonePyineWinners] = useState([])
    const [threedWinners,setThreedWinners] = useState([])


    const [temptwodWinners,setTempTwodWinners] = useState([])
    const [templonePyineWinners,setTempLonePyineWinners] = useState([])
    const [tempthreedWinners,setTempThreedWinners] = useState([])

    const [twodSaleBookList,setTwodSaleBookList] = useState([])
    const [lonePyineSaleBookList,setLonePyineSaleBookList] = useState([])
    const [threedSaleBookList,setThreedSaleBookList] = useState([])

    const {user_login} = useSelector(state => state.user)

    const fetchWinners = async () => {
      try {
        const twodWinners = await axiosInstance.get("/2d-win",{headers:{Authorization:`Bearer ${user_login.token}`}})
      const threedWinners = await axiosInstance.get("/3d-win",{headers:{Authorization:`Bearer ${user_login.token}`}})
      const lonePyineWinners = await axiosInstance.get("/lp-win",{headers:{Authorization:`Bearer ${user_login.token}`}})
        if(twodWinners.data.status === 200 && threedWinners.data.status === 200 && lonePyineWinners.data.status === 200){
          // console.log(twodWinners)
          // console.log(lonePyineWinners)
          // console.log(threedWinners)
          setTwodWinners(twodWinners?.data?.data)
          setThreedWinners(threedWinners?.data?.data)
          setLonePyineWinners(lonePyineWinners?.data?.data)

          setTempTwodWinners(twodWinners?.data?.data)
          setTempThreedWinners(threedWinners?.data?.data)
          setTempLonePyineWinners(lonePyineWinners?.data?.data)
        }
      
      } catch (error) {
        alert(error.message)
      }
      

    }

    const fetchSaleDayBook = async () => {
      try {
        const twodSaleDayBook = await axiosInstance.get("/twod-salesday-book",{headers:{Authorization:`Bearer ${user_login.token}`}})
        const threedSaleDayBook = await axiosInstance.get("/threed-salesday-book",{headers:{Authorization:`Bearer ${user_login.token}`}})
        const lonePyineSaleDayBook = await axiosInstance.get("/lonepyaing-salesday-book",{headers:{Authorization:`Bearer ${user_login.token}`}})
  
        // console.log(twodSaleDayBook)
        // console.log(lonePyineSaleDayBook)
        // console.log(threedSaleDayBook)
        setTwodSaleBookList(twodSaleDayBook?.data?.data)
        setLonePyineSaleBookList(lonePyineSaleDayBook?.data?.data)
        setThreedSaleBookList(threedSaleDayBook?.data?.data)
      } catch (error) {
        alert(error.message)
      }
     
    }

    const filter2dRound = (e) => {
      console.log(temptwodWinners)
        setTwodWinners(temptwodWinners)
        if(e.target.value){
          const filteredArr = temptwodWinners.filter((item) => {
            if(item.twod.round === e.target.value) {
              return item
            }
          })
          setTwodWinners(filteredArr)
        }
      
    }

    const filterLonePyineRound = (e) => {
      console.log(e.target.value)
      setLonePyineWinners(templonePyineWinners)
      if(e.target.value){
        const filteredArr = templonePyineWinners.filter((item) => {
          if(item.lonepyine.round === e.target.value) {
            return item
          }
        })
        // console.log(filteredArr)
  
        setLonePyineWinners(filteredArr)
        // console.log(acceptedLonePyineTransactions)
      }
    }

    const filter3DRound = (e) => {
      // console.log(e.target.value)
      setThreedWinners(tempthreedWinners)
      if(e.target.value){
        const filteredArr = tempthreedWinners.filter((item) => {
          if(item.threed.round === e.target.value) {
            // console.log(item)
            return item
          }
        })
  
        setThreedWinners(filteredArr)}
      // }else{
      //   fetch3dAcceptedTransactions()
      // }
    }

    // const fetch2dSaleDayBook = async (date) => {
    //   const res = await axiosInstance.post("/2d")
    // }
    const fetch2dWinnersDate = async (date) => {
      const res = await axiosInstance.post("/2d-win-bydate",{
        current_date : date
      },{headers:{Authorization:`Bearer ${user_login.token}`}})
      setTwodWinners(res?.data?.data)
      setTempTwodWinners(res?.data?.data)
    }

    const filter2dWinnersDate = (e) => {
      console.log(e.target.value)
      fetch2dWinnersDate(e.target.value)
    }

    const fetchLonePyineWinnersDate = async (date) => {
      const res = await axiosInstance.post("/lp-win-bydate",{
        current_date : date
      },{headers:{Authorization:`Bearer ${user_login.token}`}})
      setLonePyineWinners(res?.data?.data)
      setTempLonePyineWinners(res?.data?.data)
    }
    const filterLonePyineWinnersDate = (e) => {
      console.log(e.target.value)
      fetchLonePyineWinnersDate(e.target.value)
    }

    const fetch3dWinnersDate = async (date) => {
      const res = await axiosInstance.post("/3d-win-bydate",{
        current_date : date
      },{headers:{Authorization:`Bearer ${user_login.token}`}})
      setThreedWinners(res?.data?.data)
      setTempThreedWinners(res?.data?.data)
    }
    const filter3dWinnersDate = (e) => {
      console.log(e.target.value)
      fetch3dWinnersDate(e.target.value)

    }

    useEffect(() => {
      if(user_login.isLoggedIn && user_login.role === "agent"){ 
        fetchSaleDayBook()
        fetchWinners()
      }
      
    },[])


    const twodData = useMemo(() => {
      const transactionarr = twodWinners?.map((item) => {
        return {
          Name: item.customer_name,
          Number: item.twod.number,
          Amount: item.sale_amount,
          Compensation: item.twod.compensation,
          GameType: "2pieces",
          Date: item.twod.date,
          Round: item.twod.round,
        }
      })
      return transactionarr
    }
     )
     const twodColumns = useMemo(() => 
      [
        {
          Header: "Name",
          accessor : "Name"
        },
        {
          Header: "Number",
          accessor : "Number"
        },
        {
          Header: "Amount",
          accessor : "Amount"
        },
        {
          Header: "Compensation",
          accessor : "Compensation"
        },
        {
          Header: "Game Type",
          accessor : "GameType"
        },
        {
          Header: "Date",
          accessor : "Date"
        },
        {
          Header: "Round",
          accessor : "Round"
        },
      ]
     )
    const twodSaleBookData = useMemo(() => {
      const transactionarr = twodSaleBookList?.map((item,index) => {
        return {
          No:index + 1,
          Date: item.twod.date,
          Round: item.twod.round,
          Name: `${item.customer_name} ${item.customer_phone}`,
          GameType: "2pieces",
          Number: item.twod.number,
          Compensation: item.twod.compensation,
          Amount: item.sale_amount,
    }
      })
      return transactionarr
    }
     )
     const twodSaleBookColumns = useMemo(() => 
      [
        {
          Header: "No",
          accessor : "No"
        },
        {
          Header: "Date",
          accessor : "Date"
        },
        {
          Header: "Round",
          accessor : "Round"
        },
        {
          Header: "Name",
          accessor : "Name"
        },
        {
          Header: "Game Type",
          accessor : "GameType"
        },
        {
          Header: "Number",
          accessor : "Number"
        },
        {
          Header: "Compensation",
          accessor : "Compensation"
        },
        {
          Header: "Amount",
          accessor : "Amount"
        },
        
      ]
     )
    
     //lonepyine table data
     const lonePyineData = useMemo(() => {
      const transactionarr = lonePyineWinners?.map((item) => {
        return {
          Name: item.customer_name,
          Number: item.lonepyine.number,
          Amount: item.sale_amount,
          Compensation: item.lonepyine.compensation,
          GameType: "Lone Pyine",
          Date: item.lonepyine.date,
          Round: item.lonepyine.round,
    }
      })
      return transactionarr
    }
     )
     const LonePyineColumns = useMemo(() => 
     [
      {
        Header: "Name",
        accessor : "Name"
      },
      {
        Header: "Number",
        accessor : "Number"
      },
      {
        Header: "Amount",
        accessor : "Amount"
      },
      {
        Header: "Compensation",
        accessor : "Compensation"
      },
      {
        Header: "Game Type",
        accessor : "GameType"
      },
      {
        Header: "Date",
        accessor : "Date"
      },
      {
        Header: "Round",
        accessor : "Round"
      },
    ]
     )
     const lonePyineSaleBookData = useMemo(() => {
      const transactionarr = lonePyineSaleBookList?.map((item,index) => {
        return {
          No:index + 1,
          Date: item.lonepyine.date,
          Round: item.lonepyine.round,
          Name: `${item.customer_name} ${item.customer_phone}`,
          GameType: "Lone Pyine",
          Number: item.lonepyine.number,
          Compensation: item.lonepyine.compensation,
          Amount: item.sale_amount,
    }
      })
      return transactionarr
    }
     )
     const LonePyineSaleBookColumns = useMemo(() => 
     [
      {
        Header: "No",
        accessor : "No"
      },
      {
        Header: "Date",
        accessor : "Date"
      },
      {
        Header: "Round",
        accessor : "Round"
      },
      {
        Header: "Name",
        accessor : "Name"
      },
      {
        Header: "Game Type",
        accessor : "GameType"
      },
      {
        Header: "Number",
        accessor : "Number"
      },
      {
        Header: "Compensation",
        accessor : "Compensation"
      },
      {
        Header: "Amount",
        accessor : "Amount"
      },
      
    ]
     )
    
    
    //3d table data
     const threedData = useMemo(() => {
      const transactionarr = threedWinners?.map((item) => {
        return {
          Name: item.customer_name,
          Number: item.threed.number,
          Amount: item.sale_amount,
          Compensation: item.threed.compensation,
          GameType: "3D",
          Date: item.threed.date,
          Round: item.threed.round,
    }
      })
      return transactionarr
    }
     )
     const threedColumns = useMemo(() => 
     [
      {
        Header: "Name",
        accessor : "Name"
      },
      {
        Header: "Number",
        accessor : "Number"
      },
      {
        Header: "Amount",
        accessor : "Amount"
      },
      {
        Header: "Compensation",
        accessor : "Compensation"
      },
      {
        Header: "Game Type",
        accessor : "GameType"
      },
      {
        Header: "Date",
        accessor : "Date"
      },
      {
        Header: "Round",
        accessor : "Round"
      },
    ]
     )
     const threedSaleBookData = useMemo(() => {
      const transactionarr = threedSaleBookList?.map((item,index) => {
        return {
          No:index + 1,
          Date: item.threed.date,
          Round: item.threed.round,
          Name: `${item.customer_name} ${item.customer_phone}`,
          GameType: "3D",
          Number: item.threed.number,
          Compensation: item.threed.compensation,
          Amount: item.sale_amount,
    }
      })
      return transactionarr
    }
     )
     const threedSaleBookColumns = useMemo(() => 
     [
      {
        Header: "No",
        accessor : "No"
      },
      {
        Header: "Date",
        accessor : "Date"
      },
      {
        Header: "Round",
        accessor : "Round"
      },
      {
        Header: "Name",
        accessor : "Name"
      },
      {
        Header: "Game Type",
        accessor : "GameType"
      },
      {
        Header: "Number",
        accessor : "Number"
      },
      {
        Header: "Compensation",
        accessor : "Compensation"
      },
      {
        Header: "Amount",
        accessor : "Amount"
      },
      
    ]
     )

     if(user_login.isLoggedIn && user_login.role === "agent"){
      return (
        <>
        <Header/>
        <Navbar/>
    
        {/* 2D winners */}
        <div className='App winners-parent-container'>
            <div className='winners-header-container'>
              <p>2Pieces winners</p>
              <div className='winners-filters-container'>
                {/* <div className='winners-name-container'>
                   <input list='customers' type="text" placeholder='Customer Name'/>
                   <datalist id="customers">
                    <option value="Customer Name1"></option>
                    <option value="Customer Name2"></option>
                    <option value="Customer Name3"></option>
                   </datalist>
                </div> */}
    
                <input className='winners-date-filter' type="date" onChange={(e) => filter2dWinnersDate(e)}></input>
    
                <select className='winners-round-filter' onChange={(e) => filter2dRound(e)}>
                  <option value="">Round</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
              <div className='sale-generate-btns-container' onClick={() => setIs2dGenerateOpen(!is2dGenerateOpen)}>
                  Generate
                  <div className={is2dGenerateOpen ? 'sale-generate-dropdown-container sale-generate-dropdown-open' : 'sale-generate-dropdown-container sale-generate-dropdown-close'}>
                    <button onClick={() => handleExcelExport(twodData,"2dWinners")}>Generate to Excel</button>
                    <button onClick={() => handlePdfExport("2dWinners","#twodWinners")}>Generate to PDF</button>
                  </div>
                </div>
            </div>
    
            {/* <table className='winners-details-parent-container'>
                <tr className='winners-details-labels-container'>
                    <th>Name</th>
                    <th>Number</th>
                    <th>Amount</th>
                    <th>Comthensation</th>
                    <th>Game Type</th>
                    <th>Date</th>
                    <th>Round</th>
                </tr>
    
                <tbody className='winners-details-container'>
                    <tr className='winners-details-rows'>
                        <td>Customer Name1</td>
                        <td>32</td>
                        <td>10000ks</td>
                        <td>85</td>
                        <td>2Pieces</td>
                        <td>08/22/2022</td>
                        <td>Morning</td>
                    </tr>
                    <tr className='winners-details-rows'>
                        <td>Customer Name1</td>
                        <td>32</td>
                        <td>10000ks</td>
                        <td>85</td>
                        <td>2Pieces</td>
                        <td>08/22/2022</td>
                        <td>Morning</td>
                    </tr>
                    <tr className='winners-details-rows'>
                        <td>Customer Name1</td>
                        <td>32</td>
                        <td>10000ks</td>
                        <td>85</td>
                        <td>2Pieces</td>
                        <td>08/22/2022</td>
                        <td>Morning</td>
                    </tr>
                </tbody>
            </table> */}
             <Table 
                  id="twodWinners"
                  columns={twodColumns} 
                  data = {twodData}
                />
        </div>
    
        {/* Lone Pyine Winners */}
        <div className='App winners-parent-container'>
            <div className='winners-header-container'>
              <p>Lone Pyine winners</p>
              <div className='winners-filters-container'>
                {/* <div className='winners-name-container'>
                   <input list='customers' type="text" placeholder='Customer Name'/>
                   <datalist id="customers">
                    <option value="Customer Name1"></option>
                    <option value="Customer Name2"></option>
                    <option value="Customer Name3"></option>
                   </datalist>
                </div> */}
    
                <input className='winners-date-filter' type="date" onChange={(e) => filterLonePyineWinnersDate(e)}></input>
    
                <select className='winners-round-filter' onChange={(e) => filterLonePyineRound(e)}>
                  <option value="">Round</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                </select>
                </div>
                <div className='sale-generate-btns-container' onClick={() => setIsLonePyineGenerateOpen(!isLonePyineGenerateOpen)}>
                  Generate
                  <div className={isLonePyineGenerateOpen ? 'sale-generate-dropdown-container sale-generate-dropdown-open' : 'sale-generate-dropdown-container sale-generate-dropdown-close'}>
                    <button onClick={() => handleExcelExport(lonePyineData,"LonePyineWinners")}>Generate to Excel</button>
                    <button onClick={() => handlePdfExport("LonePyineWinners","#lonePyineWinners")}>Generate to PDF</button>
                  </div>
                </div>
            </div>
    
            {/* <div className='winners-details-parent-container'>
                <div className='winners-details-labels-container'>
                    <p>Name</p>
                    <p>Number</p>
                    <p>Amount</p>
                    <p>Compensation</p>
                    <p>Game Type</p>
                    <p>Date</p>
                    <p>Round</p>
                </div>
    
                <div className='winners-details-container'>
                    <div className='winners-details-rows'>
                        <p>Customer Name1</p>
                        <p>32</p>
                        <p>10000ks</p>
                        <p>85</p>
                        <p>2Pieces</p>
                        <p>08/22/2022</p>
                        <p>Morning</p>
                    </div>
                    <div className='winners-details-rows'>
                        <p>Customer Name1</p>
                        <p>32</p>
                        <p>10000ks</p>
                        <p>85</p>
                        <p>2Pieces</p>
                        <p>08/22/2022</p>
                        <p>Morning</p>
                    </div>
                    <div className='winners-details-rows'>
                        <p>Customer Name1</p>
                        <p>32</p>
                        <p>10000ks</p>
                        <p>85</p>
                        <p>2Pieces</p>
                        <p>08/22/2022</p>
                        <p>Morning</p>
                    </div>
                </div>
            </div> */}
             <Table 
                  id="lonePyineWinners"
                  columns={LonePyineColumns} 
                  data = {lonePyineData}
                />
        </div>
    
        {/* 3d Winners */}
        <div className='App winners-parent-container'>
            <div className='winners-header-container'>
              <p>3Pieces winners</p>
              <div className='winners-filters-container'>
                {/* <div className='winners-name-container'>
                   <input list='customers' type="text" placeholder='Customer Name'/>
                   <datalist id="customers">
                    <option value="Customer Name1"></option>
                    <option value="Customer Name2"></option>
                    <option value="Customer Name3"></option>
                   </datalist>
                </div> */}
    
                <input className='winners-date-filter' type="date" onChange={(e) => filter3dWinnersDate(e)}></input>
    
                <select className='winners-round-filter' onChange={(e) => filter3DRound(e)}>
                  <option value="">Round</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                </select>
                </div>
                <div className='sale-generate-btns-container' onClick={() => setIs3dGenerateOpen(!is3dGenerateOpen)}>
                  Generate
                  <div className={is3dGenerateOpen ? 'sale-generate-dropdown-container sale-generate-dropdown-open' : 'sale-generate-dropdown-container sale-generate-dropdown-close'}>
                    <button onClick={() =>  handleExcelExport(threedData,"3dWinners")}>Generate to Excel</button>
                    <button onClick={() => handlePdfExport("3dWinners","#threedWinners")}>Generate to PDF</button>
                  </div>
                </div>
            </div>
    
            {/* <div className='winners-details-parent-container'>
                <div className='winners-details-labels-container'>
                    <p>Name</p>
                    <p>Number</p>
                    <p>Amount</p>
                    <p>Compensation</p>
                    <p>Game Type</p>
                    <p>Date</p>
                    <p>Round</p>
                </div>
    
                <div className='winners-details-container'>
                    <div className='winners-details-rows'>
                        <p>Customer Name1</p>
                        <p>32</p>
                        <p>10000ks</p>
                        <p>85</p>
                        <p>2Pieces</p>
                        <p>08/22/2022</p>
                        <p>Morning</p>
                    </div>
                    <div className='winners-details-rows'>
                        <p>Customer Name1</p>
                        <p>32</p>
                        <p>10000ks</p>
                        <p>85</p>
                        <p>2Pieces</p>
                        <p>08/22/2022</p>
                        <p>Morning</p>
                    </div>
                    <div className='winners-details-rows'>
                        <p>Customer Name1</p>
                        <p>32</p>
                        <p>10000ks</p>
                        <p>85</p>
                        <p>2Pieces</p>
                        <p>08/22/2022</p>
                        <p>Morning</p>
                    </div>
                </div>
            </div> */}
             <Table 
                  id="threedWinners"
                  columns={threedColumns} 
                  data = {threedData}
                />
    
        </div>
    
        <div className='App transaction-parent-container'>
              <div className='transaction-header-container'>
                <p onClick={() => setHeaderCategory("2d")} className={headerCategory === "2d" ? 'transaction-header-item transaction-header-active' : "transaction-header-item"}>2D</p>
                <p onClick={() => setHeaderCategory("3d")} className={headerCategory === "3d" ? 'transaction-header-item transaction-header-active' : "transaction-header-item"}>3D</p>
              </div>
    
              <div className='transaction-category-container'>
                {/* <button onClick={() => setTransactionCategory("sale voucher")} className={transactionCategory === "sale voucher" ? 'transaction-category-btn transaction-category-btn-active' : "transaction-category-btn"}>Sale Voucher</button> */}
                <button onClick={() => setTransactionCategory("sale day book")} className={transactionCategory === "sale day book" ? 'transaction-category-btn transaction-category-btn-active' : "transaction-category-btn"}>Sale Day Book</button>
              </div>
    
              {/* {
                headerCategory === "2d" && transactionCategory ==="sale voucher" ? 
                <div className='towd-voucher-parent-container'>
                  <div className='twod-day-voucher-rows-container'></div>
                </div> : null
              } */}
              {
                headerCategory === "2d" && transactionCategory ==="sale day book" ? 
                <>
                  <div className='twod-sale-day-book-parent-container'>
                    <div className='twod-sale-day-book-header-container'>
                      <p>2Pieces</p>
                      <div className='sale-generate-btns-container' onClick={() => setIs2dSaleBookGenerateOpen(!is2dSaleBookGenerateOpen)}>
                        Generate
                        <div className={is2dSaleBookGenerateOpen ? 'sale-generate-dropdown-container sale-generate-dropdown-open' : 'sale-generate-dropdown-container sale-generate-dropdown-close'}>
                          <button onClick={() =>  handleExcelExport(twodSaleBookData,"2dSaleBook")}>Generate to Excel</button>
                          <button onClick={() => handlePdfExport("2dSaleBook","#twodSaleBook")}>Generate to PDF</button>
                        </div>
                      </div>
                    </div>
    
                    {/* <table className='twod-sale-day-book-details-parent-container'>
    
                    </table> */}
                    {/* <div className='twod-sale-day-book-label-container'>
                      <p>No</p>
                      <p>Date</p>
                      <p>Time</p>
                      <p>Name</p>
                      <p>Game Type</p>
                      <p>Number</p>
                      <p>Compensation</p>
                      <p>Amount</p>
                      <p>Total</p>
                    </div>
    
                    <div className='twod-day-sale-book-rows-container'>
                      <div className='twod-day-sale-book-row-container'>
    
                        <div className='twod-day-sale-book-row'>
                          <p>1</p>
                          <p>08/18/2022</p>
                          <p>9:51</p>
                          <div className='twod-day-sale-book-row-detail-column twod-day-sale-book-row-name-column'>
                            <p>Customer Name</p>
                            <p>0912345678</p>
                          </div>
    
                          <p>2Pieces</p>
    
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>34</p>
                            <p>48</p>
                            <p>67</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>85</p>
                            <p>80</p>
                            <p>83</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>10000ks</p>
                            <p>100000ks</p>
                            <p>20000ks</p>
                            <p className='twod-day-sale-book-seperate-row'>
                              130000ks
                            </p>
                          </div>
                          <p>130000ks</p> 
                        </div>
                        <div className='twod-day-sale-book-row-line'></div>
                      </div>
                      <div className='twod-day-sale-book-row-container'>
    
                        <div className='twod-day-sale-book-row'>
                          <p>88</p>
                          <p>01/11/2022</p>
                          <p>9:51</p>
                          <div className='twod-day-sale-book-row-detail-column twod-day-sale-book-row-name-column'>
                            <p>Customer Name name</p>
                            <p>0912345678</p>
                          </div>
    
                          <p>2Pieces</p>
    
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>34</p>
                            <p>48</p>
                            <p>67</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>85</p>
                            <p>80</p>
                            <p>83</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>10000ks</p>
                            <p>100000ks</p>
                            <p>20000ks</p>
                            <p className='twod-day-sale-book-seperate-row'>
                              130000ks
                            </p>
                          </div>
                          <p>130000ks</p> 
                        </div>
                        <div className='twod-day-sale-book-row-line'></div>
                      </div>
                      
                    </div> */}
                    <SaleBookTable 
                      id="twodSaleBook"
                      columns={twodSaleBookColumns} 
                      data = {twodSaleBookData}
                    />
                  </div>
    
    
                  <div className='twod-sale-day-book-parent-container'>
                  <div className='twod-sale-day-book-header-container'>
                      <p>Lone Pyine</p>
                      <div className='sale-generate-btns-container' onClick={() => setIsLonePyineSaleBookGenerateOpen(!isLonePyineSaleBookGenerateOpen)}>
                        Generate
                        <div className={isLonePyineSaleBookGenerateOpen ? 'sale-generate-dropdown-container sale-generate-dropdown-open' : 'sale-generate-dropdown-container sale-generate-dropdown-close'}>
                          <button onClick={() =>  handleExcelExport(lonePyineSaleBookData,"LonePyineSaleBook")}>Generate to Excel</button>
                          <button onClick={() => handlePdfExport("LonePyineSaleBook","#lonePyineSaleBook")}>Generate to PDF</button>
                        </div>
                      </div>
                    </div>
                    {/* <div className='twod-sale-day-book-label-container'>
                      <p>No</p>
                      <p>Date</p>
                      <p>Time</p>
                      <p>Name</p>
                      <p>Game Type</p>
                      <p>Number</p>
                      <p>Compensation</p>
                      <p>Amount</p>
                      <p>Total</p>
                    </div>
    
                    <div className='twod-day-sale-book-rows-container'>
                      <div className='twod-day-sale-book-row-container'>
    
                        <div className='twod-day-sale-book-row'>
                          <p>1</p>
                          <p>08/18/2022</p>
                          <p>9:51</p>
                          <div className='twod-day-sale-book-row-detail-column twod-day-sale-book-row-name-column'>
                            <p>Customer Name</p>
                            <p>0912345678</p>
                          </div>
    
                          <p>2Pieces</p>
    
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>34</p>
                            <p>48</p>
                            <p>67</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>85</p>
                            <p>80</p>
                            <p>83</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>10000ks</p>
                            <p>100000ks</p>
                            <p>20000ks</p>
                            <p className='twod-day-sale-book-seperate-row'>
                              130000ks
                            </p>
                          </div>
                          <p>130000ks</p> 
                        </div>
                        <div className='twod-day-sale-book-row-line'></div>
                      </div>
                      <div className='twod-day-sale-book-row-container'>
    
                        <div className='twod-day-sale-book-row'>
                          <p>88</p>
                          <p>01/11/2022</p>
                          <p>9:51</p>
                          <div className='twod-day-sale-book-row-detail-column twod-day-sale-book-row-name-column'>
                            <p>Customer Name name</p>
                            <p>0912345678</p>
                          </div>
    
                          <p>2Pieces</p>
    
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>34</p>
                            <p>48</p>
                            <p>67</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>85</p>
                            <p>80</p>
                            <p>83</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>10000ks</p>
                            <p>100000ks</p>
                            <p>20000ks</p>
                            <p className='twod-day-sale-book-seperate-row'>
                              130000ks
                            </p>
                          </div>
                          <p>130000ks</p> 
                        </div>
                        <div className='twod-day-sale-book-row-line'></div>
                      </div>
                      
                    </div> */}
                    <SaleBookTable 
                      id="lonePyineSaleBook"
                      columns={LonePyineSaleBookColumns} 
                      data = {lonePyineSaleBookData}
                    />
                  </div>
                </>
               
                : null
              }
              {/* {
                headerCategory === "3d" && transactionCategory ==="sale voucher" ? 
                <div className='towd-voucher-parent-container'>
                  <div className='twod-day-voucher-rows-container'></div>
                </div> : null
              } */}
              {
                headerCategory === "3d" && transactionCategory ==="sale day book" ? 
                <div className='twod-sale-day-book-parent-container'>
                  <div className='twod-sale-day-book-header-container'>
                      <p>3Pieces</p>
                      <div className='sale-generate-btns-container' onClick={() => setIs3dSaleBookGenerateOpen(!is3dSaleBookGenerateOpen)}>
                        Generate
                        <div className={is3dSaleBookGenerateOpen ? 'sale-generate-dropdown-container sale-generate-dropdown-open' : 'sale-generate-dropdown-container sale-generate-dropdown-close'}>
                          <button onClick={() =>  handleExcelExport(threedSaleBookData,"3dSaleBook")}>Generate to Excel</button>
                          <button onClick={() => handlePdfExport("3dSaleBook","#threedSaleBook")}>Generate to PDF</button>
                        </div>
                      </div>
                    </div>
                    {/* <div className='twod-sale-day-book-label-container'>
                      <p>No</p>
                      <p>Date</p>
                      <p>Time</p>
                      <p>Name</p>
                      <p>Game Type</p>
                      <p>Number</p>
                      <p>Compensation</p>
                      <p>Amount</p>
                      <p>Total</p>
                    </div>
    
                    <div className='twod-day-sale-book-rows-container'>
                      <div className='twod-day-sale-book-row-container'>
    
                        <div className='twod-day-sale-book-row'>
                          <p>1</p>
                          <p>08/18/2022</p>
                          <p>9:51</p>
                          <div className='twod-day-sale-book-row-detail-column twod-day-sale-book-row-name-column'>
                            <p>Customer Name</p>
                            <p>0912345678</p>
                          </div>
    
                          <p>3Pieces</p>
    
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>34</p>
                            <p>48</p>
                            <p>67</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>85</p>
                            <p>80</p>
                            <p>83</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>10000ks</p>
                            <p>100000ks</p>
                            <p>20000ks</p>
                            <p className='twod-day-sale-book-seperate-row'>
                              130000ks
                            </p>
                          </div>
                          <p>130000ks</p> 
                        </div>
                        <div className='twod-day-sale-book-row-line'></div>
                      </div>
                      <div className='twod-day-sale-book-row-container'>
    
                        <div className='twod-day-sale-book-row'>
                          <p>1</p>
                          <p>01/11/2022</p>
                          <p>9:51</p>
                          <div className='twod-day-sale-book-row-detail-column twod-day-sale-book-row-name-column'>
                            <p>Customer Name name</p>
                            <p>0912345678</p>
                          </div>
    
                          <p>3Pieces</p>
    
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>134</p>
                            <p>548</p>
                            <p>767</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>85</p>
                            <p>80</p>
                            <p>83</p>
                          </div>
                          <div className='twod-day-sale-book-row-detail-column'>
                            <p>10000ks</p>
                            <p>100000ks</p>
                            <p>20000ks</p>
                            <p className='twod-day-sale-book-seperate-row'>
                              130000ks
                            </p>
                          </div>
                          <p>130000ks</p> 
                        </div>
                        <div className='twod-day-sale-book-row-line'></div>
                      </div>
                      
                    </div> */}
                    <SaleBookTable 
                      id="threedSaleBook"
                      columns={threedSaleBookColumns} 
                      data = {threedSaleBookData}
                    />
    
                  </div> : null
              }
        </div>
        </>
      )
     }else{
      return(
      <Navigate to ="/" replace={true}></Navigate>
      )
     }
  
}

export default Transaction