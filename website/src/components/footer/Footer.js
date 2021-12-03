import React from 'react'
import './Footer.scss';

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-col">
        <p className="footer-text">
          Emory University
        </p>
        <p className="footer-text">
          Georgia Institute of Technology 
        </p>
      </div>
      <div className="footer-col">
        <a className="footer-link" href="/">Home</a>
        <a className="footer-link" 
          href="https://gvu.gatech.edu/research/labs/computing-and-society-lab"
          target="_blank"
          rel="noopener noreferrer"
        >Computing and Society Lab</a>
      </div>
    </div>
  )
}