import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

import "./App.css";

function App() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleFileUpload = (e) => {
		const reader = new FileReader();
		reader.readAsBinaryString(e.target.files[0]);
		reader.onload = (e) => {
			const data = e.target.result;
			const workbook = XLSX.read(data, { type: "binary" });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const parsedData = XLSX.utils.sheet_to_json(sheet);
			setData(parsedData);
		};
	};

	const handleEmailButtonClick = async (row) => {
		setLoading(true);
		setError(null);
		console.log(loading);
		console.log(error);
		console.log(row);
		try {
			const response = await axios.post("http://localhost:3100/sendemail", row);
			console.log(response);
			// Más lógica después de la respuesta exitosa...
		} catch (error) {
			console.error("Error al realizar la petición POST", error);
			setError(error);
		} finally {
			setLoading(false);
		}

		console.log("Enviando email con los datos: ", row);
	};

	return (
		<div className="App">
			<h1>Grades Report</h1>
			<p></p>
			<input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

			{data.length > 0 && (
				<table className="table">
					<thead>
						<tr>
							{Object.keys(data[0]).map((key) => (
								<th key={key}>{key}</th>
							))}
							<th>Acción</th>
						</tr>
					</thead>
					<tbody>
						{data.map((row, index) => (
							<tr key={index}>
								{Object.values(row).map((value, valueIndex) => (
									<td key={valueIndex}>{value}</td>
								))}
								<td>
									<button onClick={() => handleEmailButtonClick(row)}>
										Send report
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default App;
