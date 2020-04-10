import React from 'react';

import Board from "../components/board"

export default function Index() {


  return <main style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between safe",
  }}>
    <h1 style={{ flex: "0 auto" }}>Sidewalk Obstruction Bingo</h1>
    <div>
      <Board />
    </div>
    <div>
      <h2>How to Report</h2>
      
      <h3>Broken Sidewalk</h3>
      <p><a href="tel:503-823-1711">503-823-1711</a>{' or '}
      <a href="https://pdxreporter.org/">pdxreporter.org</a></p>

      <h3>Illegal Parking</h3>
      <p><a href="tel:503-823-5195">503-823-5195</a>{' or '}
      <a href="https://pdxreporter.org/">pdxreporter.org</a></p>
            
      <h3>Overgrown Vegetation</h3>
      <p>{'If vegetation is in the public right-of-way, contact Urban Forestry: '}
      <a href="tel:503-823-4489">503-823-4489</a>{' or '}
      <a href="https://pdxreporter.org/">pdxreporter.org</a></p>

      <h3>Work Zone Concern</h3>
      <p><a href="tel:503-823-7233">503-823-SAFE</a>{' or '}
      <a href="https://pdxreporter.org/">pdxreporter.org</a></p>
      
      <h3>Street Lighting</h3>
      <p><a href="tel:503-865-5267">503-865-5267</a>{' or '}
      <a href="https://pdxreporter.org/">pdxreporter.org</a></p>

      <h3>A-Frame Blocking Sidewalk</h3>
      <p><a href="tel:503-823-1711">503-823-1711</a>{' or '}
      <a href="https://pdxreporter.org/">pdxreporter.org</a></p>

      <h3>Scooter in Walkpath</h3>
      <p>{"Contact the e-scooter company directly using information on the scooter, or find contact information on the City's "}
      <a href="https://www.portlandoregon.gov/transportation/79174">E-Scooter Reporting and Feedback</a> {' page.'}
      </p>

      <h3>Refuse Bins in the Right-of-Way</h3>
      <p><a href="tel:503-823-7202">503-823-7202</a>{' or '} 
      <a href="https://pdxreporter.org/">pdxreporter.org</a></p>

      <h3>Other Issues</h3>
      <p>{'For all other issues, use the "other" section of '}
      <a href="https://pdxreporter.org/">pdxreporter.org</a></p>


    </div>
  </main>;
};
