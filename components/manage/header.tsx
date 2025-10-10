import HeaderAddQuestion from "./headerAddQuestion";
import HeaderAddTag from "./headerAddTag";
import HeaderUploadExcel from "./headerUploadExcel";
import HeaderExportExcel from "./headerExportExcel";

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Manage Problems</h1>
      <div className="flex space-x-3">
        {/* Add Question Dialog */}
        <HeaderAddQuestion />

        {/* Add Tag Dialog */}
        <HeaderAddTag />

        {/* Upload Excel File */}
        <HeaderUploadExcel />

        {/* Export Excel File */}
        <HeaderExportExcel />
      </div>
    </div>
  );
};

export default Header;
