import React, { useEffect, useState } from "react";
import Axios from "axios";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import "./App.css";
import "/node_modules/primeflex/primeflex.css";
import axios from "axios";

function App() {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    nic_no: { value: null, matchMode: FilterMatchMode.EQUALS },
    contact_no: { value: null, matchMode: FilterMatchMode.EQUALS },
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [name,setname]=useState('');
  const [nic_no,setnic_no]=useState('');
  const [contact_no,setcontact_no]=useState('');
  const [checkin_date, setCheckin_date] = useState(null);
  const [checkout_date, setCheckout_date] = useState(null);
  const [staytype, setstaytype] = useState(null);
  const [room, setroom] = useState(null);
  const[subtotal,setsubtotal]=useState(null);
  const[tax,settax]=useState(null);
  const[total,settotal]=useState(null);
  const [suite, setsuite] = useState(null);
  const [available,setavailable] = useState([]);
  const namechange = (e)=> {
    setname(e.target.value)
  }
  console.log(name);
  const nicchange = (e)=> {
    setnic_no(e.target.value)
  }
  console.log(name);
  const phonechange = (e)=> {
    setcontact_no(e.target.value)
  }
  console.log(name);
  useEffect(()=> {
    if (suite) {
      const {name} = suite;
      console.log(name);
      const run = async ()=> {
        const resp = await axios.get(`http://127.0.0.1:8000/api/rooms_sorted/${name}`);
        setavailable(resp.data)
      }
      run()
      console.log(suite);
    }

  },[suite])
  const types = [
      { name: 'FB', code: 'NY' },
      { name: 'BB', code: 'RM' },
  ];
  const suites = [
    { name: "Standard", code: "S" },
    { name: "Deluxe", code: "D" },
  ];
  const rooms = available.map(item=> {
    return {name:item};
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    Axios.get("http://127.0.0.1:8000/api/booking_with_rooms")
      .then((res) => {
        console.log(res.data);
        setBookings(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleClick =() =>{
    Axios.post(`http://127.0.0.1:8000/api/booking`, {
      name:name,
      phone:contact_no,
      nic:nic_no,      
      suitetype:suite,
      roomid:room,
      checkin:checkin_date,
      checkout:checkout_date,
      stay:staytype,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      },[]);
  }

  useEffect(() => {
    if(staytype && suite && checkin_date && checkout_date){
      
      let days = checkout_date.getTime() - checkin_date.getTime();
      let daycount = Math.ceil(days/(1000*3600*24));
      let rate = 0;
      const{name:stay} = staytype;
      const{name:suitetype} = suite;
      console.log(stay, suitetype);
      if(stay === "BB" && suitetype === "Standard"){
        rate = 15000;
      }
      if(stay === "BB" && suitetype === "Deluxe"){
        rate = 25000;
      }
      if(stay === "FB" && suitetype === "Standard"){
        rate = 25000;
      }
      if(stay === "FB" && suitetype === "Deluxe"){
        rate =40000;
      }

      const subtotal = rate*daycount;
      const tax = subtotal*0.1;
      const total = subtotal + tax;
      setsubtotal(subtotal);
      settax(tax);
      settotal(total);
    }
  });

  return (
    <div className="App">
      <div className="header">
        <div className="logo">ABC Hotel</div>
        <div className="title">ABC Hotel-Check-In-System</div>
      </div>

      <div className="body">
        <div className="headerbody">
          <div className="field row">
            <label htmlFor="text">Check-In List</label>
            <Button label="New Check-In" onClick={() => setVisible(true)} />
            <Dialog header="Add New Check-In" visible={visible} style={{ width: "70%", height: "90%" }}
              onHide={() => setVisible(false)}>
                <form>
              <div className="card">
                <h5>Guest Information</h5>
                <div className="formgrid grid">
                  <div className="field col-12 md:col-3">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" value={name} onChange={namechange} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
                  </div>
                  <div className="field col-12 md:col-3">
                    <label htmlFor="nic_no">NIC</label>
                    <input id="nic_no" type="text" value={nic_no} onChange={nicchange} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
                  </div>
                  <div className="field col-12 md:col-3">
                    <label htmlFor="contact_no">Contact Number</label>
                    <input
                      id="contact_no" type="text" value={contact_no} onChange={phonechange} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
                  </div>

                  <div className="card">
                    <h5>Check In Details</h5>
                    <div className="formgrid grid">
                      <div className="field col-12 md:col-3">
                        <label htmlFor="checkin_date">Staying Period</label>
                        <Calendar
                          value={checkin_date} onChange={(e) => setCheckin_date(e.value)} placeholder="Start Date" dateFormat="yy/mm/dd"/>
                      </div>
                      <div className="field col-12 md:col-3">
                        <label htmlFor="checkout_date">.</label>
                        <Calendar
                          value={checkout_date} onChange={(e) => setCheckout_date(e.value)} placeholder="End Date" dateFormat="yy/mm/dd" />
                      </div>
                      <div className="field col-12 md:col-3">
                        <label htmlFor="stay">Stay Type</label>
                        <Dropdown value={staytype} onChange={(e) => setstaytype(e.value)} options={types} optionLabel="name" placeholder="Select" className="w-full md:w-14rem" />
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="formgrid grid">
                      <div className="field col-12 md:col-6 ">
                        <label htmlFor="suite">Room Suite</label>
                        <Dropdown value={suite} onChange={(e) => setsuite(e.value)} options={suites} optionLabel="name" placeholder="Select" className="w-full md:w-14rem" />
                      </div>
                      <div className="field col-12 md:col-3">
                        <label htmlFor="room">Room No</label>
                        <Dropdown value={room} onChange={(e) => setroom(e.value)} options={rooms} optionLabel="name" placeholder="Select" className="w-full md:w-14rem" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid">
                  <div className="col-2">Sub Total</div>
                  <div className="col-2">{subtotal}.00</div>
                </div>
                <div className="grid">
                  <div className="col-2">Tax 10%</div>
                  <div className="col-2">{tax}.00</div>
                </div>
                <div className="grid">
                  <div className="col-2">Total</div>
                  <div className="col-2">LKR{total}.00</div>
                </div>

                <div className="field row justify-content-right">
                  <Button label="Check-In" onSubmit={handleClick} />
                </div>
              </div>
              </form>
            </Dialog>
          </div>
        </div>

        <div className="card">
          <DataTable value={bookings} paginator rows={6} tableStyle={{ minWidth: "50rem" }} 
            filters={filters} filterDisplay="row" globalFilterFields={["name", "id", "nic_no", "contact_no"]}
            header={header} emptyMessage="No results found.">
            <Column field="id" header="Room ID" sortable style={{ width: "12.5%" }} ></Column>
            <Column field="status" header="Status" sortable style={{ width: "12.5%" }} ></Column>
            <Column field="suite_type" header="Room Suite" sortable style={{ width: "12.5%" }} ></Column>
            <Column field="name" header="Guest" style={{ width: "12.5%" }} ></Column>
            <Column field="checkin_date" header="Staying Period" style={{ width: "12.5%" }} ></Column>
            <Column field="stay_type" header="Stay Type" sortable style={{ width: "12.5%" }} ></Column>
            <Column field="contact_no" header="Contact" style={{ width: "12.5%" }} ></Column>
            <Column field="nic_no" header="NIC" style={{ width: "12.5%" }} ></Column>
          </DataTable>
        </div>
      </div>

      <div className="footer">
        <div className="copy-right">Copyright 2023|ABC Hotel Group</div>
      </div>
    </div>
  );
}

export default App;
