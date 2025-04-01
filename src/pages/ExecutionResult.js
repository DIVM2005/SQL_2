import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ExecutionResult = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query] = useState('SELECT * FROM users WHERE age > 25');
  const [executionTime] = useState('0.0234s');
  const [rowCount] = useState(150);
  const [results] = useState([
    {
      id: 1,
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      role: 'Admin',
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 28,
      email: 'jane@example.com',
      role: 'User',
    },
    // Add more sample data as needed
  ]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownload = () => {
    // TODO: Implement CSV download functionality
    console.log('Downloading results...');
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Query Results</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyQuery}
            >
              Copy Query
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download CSV
            </Button>
          </Box>
        </Box>

        <Paper variant="outlined" sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
            {query}
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip
            label={`Execution Time: ${executionTime}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Rows: ${rowCount}`}
            color="secondary"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(results[0]).map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {results
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, cellIndex) => (
                      <TableCell key={cellIndex}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={results.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Container>
  );
};

export default ExecutionResult; 