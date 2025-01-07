import React from 'react'

const PdfViewer = ({fileUrl}) => {
  console.log(fileUrl)
  return (
    <div className="h-[90vh] overflow-hidden">
      <iframe
        src={fileUrl + "#toolbar=0"}
        height="100%"
        width="100%"
        className="h-full w-full"
        style={{ overflow: 'hidden', border: 'none' }}
      />
    </div>
  )
}

export default PdfViewer