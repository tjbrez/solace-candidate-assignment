"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/db/schema";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/advocates")
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/advocates?search=${encodeURIComponent(newSearchTerm)}`);
      const data = await response.json();
      setFilteredAdvocates(data.data);
    } catch (error) {
      console.error('Error fetching filtered results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="container mx-auto px-6 py-8">
      <h1 className="page-title">Solace Advocates</h1>
      
      <div className="search-card">
        <div className="space-y-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-600">
            Search Advocates
          </label>
          <div className="flex gap-4">
            <input
              id="search"
              type="text"
              placeholder="Search by name, city, degree, or specialties..."
              className="search-input"
              onChange={onChange}
              value={searchTerm}
            />
            <button 
              onClick={onClick}
              className="primary-button"
            >
              Reset
            </button>
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600">
              Showing results for: <span className="font-medium">{searchTerm}</span>
            </p>
          )}
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
      {isLoading ? (
          <div className="loading-overlay">
            <div className="spinner" />
          </div>
        ) : (
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
        )}
      </div>
    </main>
  );
}
