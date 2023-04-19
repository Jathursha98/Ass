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
import { Divider } from 'primereact/divider';
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
  const [name, setname] = useState("");
  const [nic_no, setnic_no] = useState("");
  const [contact_no, setcontact_no] = useState("");
  const [checkin_date, setCheckin_date] = useState("");
  const [checkout_date, setCheckout_date] = useState("");
  const [staytype, setstaytype] = useState("");
  const [room, setroom] = useState("");
  const [subtotal, setsubtotal] = useState("");
  const [tax, settax] = useState("");
  const [total, settotal] = useState("");
  const [suite, setsuite] = useState("");
  const [available, setavailable] = useState([]);
  const namechange = (e) => {
    setname(e.target.value);
  };
  console.log(name);
  const nicchange = (e) => {
    setnic_no(e.target.value);
  };
  console.log(name);
  const phonechange = (e) => {
    setcontact_no(e.target.value);
  };
  console.log(name);
  useEffect(() => {
    if (suite) {
      const { name } = suite;
      console.log(name);
      const run = async () => {
        const resp = await axios.get(
          `http://127.0.0.1:8000/api/rooms_sorted/${name}`
        );
        setavailable(resp.data);
      };
      run();
      console.log(suite);
    }
  }, [suite]);
  const types = [
    { name: "FB", code: "NY" },
    { name: "BB", code: "RM" },
  ];
  const suites = [
    { name: "Standard", code: "S" },
    { name: "Deluxe", code: "D" },
  ];
  const rooms = available.map((item) => {
    return { name: item };
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
      <div className="flex justify-content-between">
        <div className="card flex flex-wrap justify-content-center align-items-center gap-3">
          <label htmlFor="text">Check-In List</label>
          <Button label="New Check-In" onClick={() => setVisible(true)} />
        </div>
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
        var sampleJSON = [
          {
            id: "#01",
            status: "Booked",
            suite_type: "Deluxe",
            name: "Sample1",
            checkin_date: "2023-23-12 - 2024-23-1",
            stay_type: "FB",
            contact_no: "07712238484",
            nic_no: "9822848483V",
          },
          {
            id: "#02",
            status: "Booked",
            suite_type: "Standard",
            name: "Sample2",
            checkin_date: "2023-23-12 - 2024-23-1",
            stay_type: "BB",
            contact_no: "01114238484",
            nic_no: "972245483V",
          },
          {
            id: "#03",
            status: "Available",
            suite_type: "Standard",
          },
        ];
        setBookings(sampleJSON);
      });
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();
    function convert(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }

    const {name:su} = suite;
    const {name:st} = staytype;
    const {name:roomnumber} = room;

    Axios.post("http://127.0.0.1:8000/api/booking", {
      name: name,
      contact_no: contact_no,
      nic_no: nic_no,
      suite_type: su,
      room_id: roomnumber,
      checkin_date: convert(checkin_date),
      checkout_date: convert(checkout_date),
      stay_type:st,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      }, []);
    
  };

  useEffect(() => {
    if (staytype && suite && checkin_date && checkout_date) {
      let days = checkout_date.getTime() - checkin_date.getTime();
      let daycount = Math.ceil(days / (1000 * 3600 * 24));
      let rate = 0;
      const { name: stay } = staytype;
      const { name: suitetype } = suite;
      console.log(stay, suitetype);
      if (stay === "BB" && suitetype === "Standard") {
        rate = 15000;
      }
      if (stay === "BB" && suitetype === "Deluxe") {
        rate = 25000;
      }
      if (stay === "FB" && suitetype === "Standard") {
        rate = 25000;
      }
      if (stay === "FB" && suitetype === "Deluxe") {
        rate = 40000;
      }

      const subtotal = rate * daycount;
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      setsubtotal(subtotal);
      settax(tax);
      settotal(total);
    }
  });

  return (
    <div className="card flex flex-wrap relative w-screen h-screen bg-white">
      <div className="card flex justify-content-start flex-wrap absolute w-screen h-4rem bg-teal-100">
        <div className="card flex align-content-center justify-content-centre w-8rem h-2rem ml-5 mt-3 font-semibold text-bluegray-700 text-2xl text-justify">ABC Hotel</div>
        <div className="card flex align-content-center justify-content-center w-18rem h-2rem ml-8 mt-3 font-normal text-xl text-bluegray-700">
          ABC Hotel-Check-In-System
        </div>
      </div>

      <div className="card w-full">
        <div className="card w-full mt-7">
          <div className="card">
            <div className="card flex flex-wrap justify-content-center align-items-center gap-3">
              <Dialog
                header="Add New Check-In"
                visible={visible}
                onHide={() => setVisible(false)}
                style={{ width: '50vw' }} 
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
              >
                <Divider />
                <form onSubmit={(e)=> onSubmit(e)}>
                  <div className="card">
                    <h5>Guest Information</h5>
                    <div className="formgrid grid">
                      <div className="field col-12 md:col-3">
                        <label htmlFor="name">Name</label>
                        <input
                          id="name"
                          type="text"
                          size="30"
                          value={name}
                          onChange={namechange}
                          required
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                      <div className="field col-12 md:col-3">
                        <label htmlFor="nic_no">NIC</label>
                        <input
                          id="nic_no"
                          type="text"
                          value={nic_no}
                          onChange={nicchange}
                          required
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                      <div className="field col-12 md:col-3">
                        <label htmlFor="contact_no">Contact Number</label>
                        <input
                          id="contact_no"
                          type="text"
                          value={contact_no}
                          onChange={phonechange}
                          required
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>

                      <div className="card">
                        <h5>Check In Details</h5>
                        <div className="formgrid grid">
                          <div className="field col-12 md:col-3">
                            <label htmlFor="checkin_date">Staying Period</label>
                            <Calendar
                              value={checkin_date}
                              onChange={(e) => setCheckin_date(e.value)}
                              required
                              placeholder="Start Date"
                              dateFormat="yy/mm/dd"
                            />
                          </div>
                          <div className="field col-12 md:col-3">
                            <label htmlFor="checkout_date">.</label>
                            <Calendar
                              value={checkout_date}
                              onChange={(e) => setCheckout_date(e.value)}
                              required
                              placeholder="End Date"
                              dateFormat="yy/mm/dd"
                            />
                          </div>
                          <div className="field col-12 md:col-3">
                            <label htmlFor="stay">Stay Type</label>
                            <Dropdown
                              value={staytype}
                              onChange={(e) => setstaytype(e.value)}
                              options={types}
                              optionLabel="name"
                              required
                              placeholder="Select"
                              className="w-full md:w-14rem"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <div className="formgrid grid">
                          <div className="field col-12 md:col-6 ">
                            <label htmlFor="suite">Room Suite</label>
                            <Dropdown
                              value={suite}
                              onChange={(e) => setsuite(e.value)}
                              required
                              options={suites}
                              optionLabel="name"
                              placeholder="Select"
                              className="w-full md:w-14rem"
                            />
                          </div>
                          <div className="field col-12 md:col-3">
                            <label htmlFor="room">Room No</label>
                            <Dropdown
                              value={room}
                              onChange={(e) => setroom(e.value)}
                              required
                              options={rooms}
                              optionLabel="name"
                              placeholder="Select"
                              className="w-full md:w-14rem"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                   
                    <div className="card">
                    <div className="grid justify-content-end">
                      <div className="col-2 pr-2">Sub Total</div>
                      <div className="col-2 pl-7">{subtotal}.00</div>

                    </div>
                      <div className="grid justify-content-end">
                        <div className="col-2 pr-2">Tax 10%</div>
                        <div className="col-2 pl-7">{tax}.00</div>

                      </div>
                      <div className="grid justify-content-end">
                        <div className="col-2 pr-2">Total</div>
                        <div className="col-2 pl-5">LKR {total}.00</div>

                      </div>

                      <Divider />

                      <div className="card flex flex-wrap justify-content-end">
                        <Button label="Check-In" onSubmit={onSubmit} />
                      </div>
                    </div>
                  </div>
                </form>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="card">
          <DataTable
            value={bookings}
            paginator
            rows={5}
            tableStyle={{ minWidth: "50rem" }}
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            filters={filters}
            filterDisplay="row"
            globalFilterFields={["name", "id", "nic_no", "contact_no"]}
            header={header}
            emptyMessage="No results found."
          >
            <Column
              field="id"
              header="Room ID"
              sortable
              //width is not defined so that it will be automatically allocated.
              // style={{ width: "12.5%" }}
            ></Column>
            <Column
              field="status"
              header="Status"
              sortable
              //       style={{ width: "12.5%" }}
            ></Column>
            <Column
              field="suite_type"
              header="Room Suite"
              sortable
              //            style={{ width: "12.5%" }}
            ></Column>
            <Column
              field="name"
              header="Guest"
              //           style={{ width: "12.5%" }}
            ></Column>
            <Column
              field="checkin_date"
              header="Staying Period"
              //         style={{ width: "12.5%" }}
            ></Column>
            <Column
              field="stay_type"
              header="Stay Type"
              sortable
              //       style={{ width: "12.5%" }}
            ></Column>
            <Column
              field="contact_no"
              header="Contact"
              //     style={{ width: "12.5%" }}
            ></Column>
            <Column
              field="nic_no"
              header="NIC"
              //   style={{ width: "12.5%" }}
            ></Column>
          </DataTable>
        </div>
      </div>

      <div className="card w-full h-4rem mt-1 bg-bluegray-100">
        <div className="flex justify-content-center flex-wrap mt-4 text-bluegray-700">
          Copyright 2023 | ABC Hotel Group
          </div>
      </div>
    </div>
  );
}

export default App;
