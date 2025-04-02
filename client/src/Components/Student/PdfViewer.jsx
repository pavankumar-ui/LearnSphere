import { useState, useEffect, useContext} from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { AuthContext } from "../../context/auth-context";
import { AppContext } from "../../context/AppContext";
import axios from "axios";


const PdfViewer = ({ signedUrl }) => {
  const { id, moduleId, lessonId } = useParams();
  const [pdfUrl, setPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const {backend_url} = useContext(AppContext);
  const {token,user} = useContext(AuthContext);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const {data} = await axios(`${backend_url}/student/video-url`,{
            params:{
                courseId:id,
                moduleId,
                lessonId,
            },
            headers:{
                Authorization: `Bearer ${token}`,
            }
        });
        if (data.success && data.videoURL?.signedUrl) {
          setPdfUrl(data.videoURL.signedUrl);
          console.log("DocURL:", data.videoURL.signedUrl);
        } else {
          console.error("Failed to fetch PDF URL");
        }
      } catch (error) {
        console.error("Error fetching PDF URL:", error);
      }
    };

    fetchPdfUrl();
  }, [signedUrl]);

  return (
    <div>
      {pdfUrl ? (
        <Document file={pdfUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} width={600} />
          ))}
        </Document>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default PdfViewer;
