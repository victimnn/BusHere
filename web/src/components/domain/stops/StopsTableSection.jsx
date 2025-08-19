import React from 'react';
import Table from '@web/components/common/data-display/Table';

const StopsTableSection = ({ 
  tableHeaders, 
  tableData, 
  onRowClick 
}) => {
  return (
    <div className="table-responsive stops-table-section">
      <Table 
        headers={tableHeaders}
        data={tableData}
        itemsPerPage={10}
        searchable={true}
        className="table-striped table-hover"
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default StopsTableSection;
