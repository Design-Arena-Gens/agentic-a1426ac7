'use client';

import { useState, useEffect } from 'react';

interface WeightRecord {
  id: number;
  checkNumber: string;
  plateNumber: string;
  yukBilan: number;
  yuksiz: number;
  sofVazin: number;
  sana: string;
  summa: number;
}

export default function Home() {
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [checkNumber, setCheckNumber] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [yukBilan, setYukBilan] = useState('');
  const [yuksiz, setYuksiz] = useState('');
  const [sana, setSana] = useState('');
  const [summa, setSumma] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const savedRecords = localStorage.getItem('weightRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }

    const today = new Date().toISOString().split('T')[0];
    setSana(today);

    const lastCheckNumber = localStorage.getItem('lastCheckNumber');
    setCheckNumber(lastCheckNumber ? String(Number(lastCheckNumber) + 1) : '1');
  }, []);

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('weightRecords', JSON.stringify(records));
    }
  }, [records]);

  const calculateSofVazin = (yukBilan: number, yuksiz: number): number => {
    return yukBilan - yuksiz;
  };

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleAdd = () => {
    if (!plateNumber || !yukBilan || !yuksiz || !sana || !summa) {
      showAlertMessage('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }

    const yukBilanNum = parseFloat(yukBilan);
    const yuksizNum = parseFloat(yuksiz);
    const summaNum = parseFloat(summa);
    const sofVazinCalc = calculateSofVazin(yukBilanNum, yuksizNum);

    const newRecord: WeightRecord = {
      id: Date.now(),
      checkNumber,
      plateNumber,
      yukBilan: yukBilanNum,
      yuksiz: yuksizNum,
      sofVazin: sofVazinCalc,
      sana,
      summa: summaNum,
    };

    setRecords([...records, newRecord]);
    localStorage.setItem('lastCheckNumber', checkNumber);

    const nextCheckNumber = String(Number(checkNumber) + 1);
    setCheckNumber(nextCheckNumber);
    setPlateNumber('');
    setYukBilan('');
    setYuksiz('');
    setSumma('');

    showAlertMessage('Ma\'lumot muvaffaqiyatli qo\'shildi!');
  };

  const handleEdit = (record: WeightRecord) => {
    setEditingId(record.id);
    setCheckNumber(record.checkNumber);
    setPlateNumber(record.plateNumber);
    setYukBilan(String(record.yukBilan));
    setYuksiz(String(record.yuksiz));
    setSana(record.sana);
    setSumma(String(record.summa));
  };

  const handleUpdate = () => {
    if (!plateNumber || !yukBilan || !yuksiz || !sana || !summa) {
      showAlertMessage('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }

    const yukBilanNum = parseFloat(yukBilan);
    const yuksizNum = parseFloat(yuksiz);
    const summaNum = parseFloat(summa);
    const sofVazinCalc = calculateSofVazin(yukBilanNum, yuksizNum);

    setRecords(records.map(record =>
      record.id === editingId
        ? {
            ...record,
            checkNumber,
            plateNumber,
            yukBilan: yukBilanNum,
            yuksiz: yuksizNum,
            sofVazin: sofVazinCalc,
            sana,
            summa: summaNum
          }
        : record
    ));

    setEditingId(null);
    setCheckNumber(String(Number(checkNumber) + 1));
    setPlateNumber('');
    setYukBilan('');
    setYuksiz('');
    setSumma('');

    showAlertMessage('Ma\'lumot muvaffaqiyatli yangilandi!');
  };

  const handleDelete = (id: number) => {
    if (confirm('Rostdan ham o\'chirmoqchimisiz?')) {
      setRecords(records.filter(record => record.id !== id));
      showAlertMessage('Ma\'lumot o\'chirildi!');
    }
  };

  const handleReload = () => {
    setEditingId(null);
    setPlateNumber('');
    setYukBilan('');
    setYuksiz('');
    setSumma('');
    const lastCheckNumber = localStorage.getItem('lastCheckNumber');
    setCheckNumber(lastCheckNumber ? String(Number(lastCheckNumber) + 1) : '1');
    const today = new Date().toISOString().split('T')[0];
    setSana(today);
    showAlertMessage('Forma tozalandi!');
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredRecords = records.filter(record =>
    record.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.checkNumber.includes(searchTerm) ||
    record.sana.includes(searchTerm)
  );

  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span style="color: red; font-weight: bold;">$1</span>');
  };

  useEffect(() => {
    if (yukBilan && yuksiz) {
      const sofVazinCalc = calculateSofVazin(parseFloat(yukBilan), parseFloat(yuksiz));
      // Auto-calculate displayed in the readonly field
    }
  }, [yukBilan, yuksiz]);

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1516788875874-c5912cae7b43?w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: darkMode ? 'overlay' : 'normal',
        backgroundColor: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)'
      }}
    >
      {/* Alert */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          {alertMessage}
        </div>
      )}

      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} shadow-lg backdrop-blur-sm print:bg-white`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🐪🐪🐪</div>
              <h1 className="text-2xl font-bold">Tuyalar Karavani - Vazn Tizimi</h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 print:hidden"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          <div className="flex gap-2 print:hidden">
            <input
              type="text"
              placeholder="Qidirish (Raqam, Check, Sana)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Data Entry Form */}
        <div className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} rounded-lg shadow-lg p-6 mb-6 backdrop-blur-sm print:hidden`}>
          <h2 className="text-xl font-bold mb-4">Ma'lumot Kiritish</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Check Raqami</label>
              <input
                type="text"
                value={checkNumber}
                onChange={(e) => setCheckNumber(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Davlat Raqami</label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Yuk bilan (Kg)</label>
              <input
                type="number"
                value={yukBilan}
                onChange={(e) => setYukBilan(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Yuksiz (Kg)</label>
              <input
                type="number"
                value={yuksiz}
                onChange={(e) => setYuksiz(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sof Vazin (Kg)</label>
              <input
                type="number"
                value={yukBilan && yuksiz ? calculateSofVazin(parseFloat(yukBilan), parseFloat(yuksiz)) : ''}
                readOnly
                className={`w-full px-3 py-2 rounded border ${
                  darkMode ? 'bg-gray-600 border-gray-600' : 'bg-gray-100 border-gray-300'
                } cursor-not-allowed`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sana</label>
              <input
                type="date"
                value={sana}
                onChange={(e) => setSana(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Summa</label>
              <input
                type="number"
                value={summa}
                onChange={(e) => setSumma(e.target.value)}
                placeholder="30,000 / 40,000"
                className={`w-full px-3 py-2 rounded border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {editingId ? (
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                ✏️ Yangilash
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                ➕ Qo'shish
              </button>
            )}
            <button
              onClick={handleReload}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              🔄 Tozalash
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              🖨️ Chop etish
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} rounded-lg shadow-lg overflow-hidden backdrop-blur-sm print:bg-white`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} print:bg-gray-200`}>
                <tr>
                  <th className="px-4 py-3 text-left">Check №</th>
                  <th className="px-4 py-3 text-left">Davlat Raqami</th>
                  <th className="px-4 py-3 text-left">Yuk bilan</th>
                  <th className="px-4 py-3 text-left">Yuksiz</th>
                  <th className="px-4 py-3 text-left">Sof Vazin</th>
                  <th className="px-4 py-3 text-left">Sana</th>
                  <th className="px-4 py-3 text-left">Summa</th>
                  <th className="px-4 py-3 text-left print:hidden">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} print:hover:bg-white`}
                  >
                    <td
                      className="px-4 py-3"
                      dangerouslySetInnerHTML={{ __html: highlightText(record.checkNumber) }}
                    />
                    <td
                      className="px-4 py-3"
                      dangerouslySetInnerHTML={{ __html: highlightText(record.plateNumber) }}
                    />
                    <td className="px-4 py-3">{record.yukBilan.toLocaleString()} kg</td>
                    <td className="px-4 py-3">{record.yuksiz.toLocaleString()} kg</td>
                    <td className="px-4 py-3 font-bold">{record.sofVazin.toLocaleString()} kg</td>
                    <td
                      className="px-4 py-3"
                      dangerouslySetInnerHTML={{ __html: highlightText(record.sana) }}
                    />
                    <td className="px-4 py-3">{record.summa.toLocaleString()} so'm</td>
                    <td className="px-4 py-3 print:hidden">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Ma'lumot topilmadi
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-sm opacity-75">
          Jami yozuvlar: {filteredRecords.length}
        </div>
      </div>
    </div>
  );
}
