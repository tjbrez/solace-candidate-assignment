"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/db/schema";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      const searchTermLower = newSearchTerm.toLowerCase();
      return (
        advocate.firstName.toLowerCase().includes(searchTermLower) ||
        advocate.lastName.toLowerCase().includes(searchTermLower) ||
        advocate.city.toLowerCase().includes(searchTermLower) ||
        advocate.degree.toLowerCase().includes(searchTermLower) ||
        (advocate.specialties as string[]).some((specialty) =>
          specialty.toLowerCase().includes(searchTermLower)
        ) ||
        advocate.yearsOfExperience.toString().includes(newSearchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: {searchTerm}
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="table-header">First Name</th>
              <th className="table-header">Last Name</th>
              <th className="table-header">City</th>
              <th className="table-header">Degree</th>
              <th className="table-header">Specialties</th>
              <th className="table-header">Years of Experience</th>
              <th className="table-header">Phone Number</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredAdvocates.map((advocate) => (
              <tr key={`${advocate.id}`} className="hover:bg-[#F1F5F9]">
                <td className="table-cell">{advocate.firstName}</td>
                <td className="table-cell">{advocate.lastName}</td>
                <td className="table-cell">{advocate.city}</td>
                <td className="table-cell">{advocate.degree}</td>
                <td className="table-cell">
                  {(advocate.specialties as string[]).map((specialty, index) => (
                    <div key={`${specialty}-${index}`} className="mb-1 last:mb-0">{specialty}</div>
                  ))}
                </td>
                <td className="table-cell">{advocate.yearsOfExperience}</td>
                <td className="table-cell">{advocate.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
