import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Container,
  Button,
  Select,
  Input,
  ButtonGroup,
} from '@chakra-ui/react'
function App() {
  interface LadokObject {
    id: number
    socialSecurity: string
    courseCode: string;
    courseModule: string;
    grade: string;
    date: string;
    status: "draft" | "done" | "certified" | "obstacle"
  }

  const [ladok, setLadok] = useState<LadokObject[]>([])

  useEffect(() => {
    fetch('http://localhost:3001/results').then(res => res.json()).then(setLadok)
    console.log(ladok)
  }, [])

  return (
    <Box padding="2">
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box>
          <Text marginBottom="2" fontWeight="bold">Markera</Text>
          <ButtonGroup variant="outline" spacing="2">
            <Button>Alla</Button>
            <Button>Betygsatta</Button>
            <Button>Inga</Button>
          </ButtonGroup>
        </Box>
        <Box>

          <Text marginBottom="2" fontWeight="bold">Datum för markerade</Text>
          <Box display="flex" flexDirection="row">
            <Input
              placeholder="Datum"
              size="md"
              type="date"
            />
            <Button>Sätt datum</Button>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row">
          <Text>Spara som</Text>
          <Select placeholder='Select option'>
            {
              ["draft", "done", "certified", "obstacle"].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))
            }
          </Select>
          <Button>Överför</Button>
        </Box>
      </Box>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Namn</Th>
              <Th>Omdöme</Th>
              <Th>Betyg i Canvas</Th>
              <Th>Betyg i Ladok</Th>
              <Th>Examinationsdatum</Th>
              <Th>Status</Th>
              <Th>Information</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ladok.map((item, index) => (
              <Tr key={index}>
                <Td>{item.socialSecurity}</Td>
                <Td>{item.courseCode}</Td>
                <Td>{item.courseModule}</Td>
                <Td>{item.grade}</Td>
                <Td>{item.date}</Td>
                <Td>{item.status}</Td>
                <Td></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default App
