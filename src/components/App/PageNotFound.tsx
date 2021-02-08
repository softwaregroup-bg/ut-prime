import React from 'react';

const PageNotFound = () => (
    <blockquote style={{padding: '15px'}}>
        <h2>Error 404 Not Found</h2>
        <p>Our apologies for the temporary inconvenience. The requested URL was not found on this server.  We suggest you try one of the links below:</p>
        <ul>
            <li><b>Verify url and typos</b> - The web page you were attempting to view may not exist or may have moved - try <em>checking the web address for typos</em>.</li>
            <li><b>E-mail us</b> - If you followed a link from somewhere, please let us know at <a href='mailto:support@softwaregroup.com'>support@softwaregroup.com</a>. Tell us where you came from and what you were looking for, and we@apos;ll do our best to fix it.</li>
        </ul>
    </blockquote>
);

export default PageNotFound;
