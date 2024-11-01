import './App.css'
import TableToExcel from "./components/TableToExcel";

type DataItem = Record<string, string|number>

interface Header {
    label: string;
    key: keyof DataItem;
}

function App() {
    const dataRows: DataItem[] = [
        { id: 1, name: 'Ali', title: 'Developer',age: 25 },
        { id: 2, name: 'Sardor', title: 'Designer' ,age: 30},
        { id: 3, name: 'Bobur', title: 'Product Manager' ,age: 35},
    ];

    const headers: Header[] = [
        { label: 'User ID', key: 'id' },
        { label: 'Full Name', key: 'name' },
        { label: 'Job Title', key: 'title' },
        { label: 'Age', key: 'age' },
    ];

  return <TableToExcel {...{dataRows,headers, name:'Invoices'}}/>

}

export default App
