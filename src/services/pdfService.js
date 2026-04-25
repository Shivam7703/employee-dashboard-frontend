// PDF handling utilities
export const downloadPayslip = (pdfUrl, fileName) => {
  // Open in new tab for preview
  window.open(pdfUrl, '_blank')
}

export const printPayslip = (pdfUrl) => {
  const printWindow = window.open(pdfUrl, '_blank')
  printWindow?.print()
}

export const sharePayslip = async (pdfUrl, fileName) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Salary Slip',
        text: 'Your monthly salary slip',
        url: pdfUrl,
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  } else {
    // Fallback: copy link to clipboard
    await navigator.clipboard.writeText(pdfUrl)
    alert('Link copied to clipboard!')
  }
}