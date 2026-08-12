export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="premium-card p-12 text-center max-w-lg">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-check text-3xl text-green-600"></i>
        </div>
        <h1 className="serif text-4xl mb-4">Payment Successful</h1>
        <p className="text-muted mb-8">
          Thank you for your payment. Your transaction was successful. If this was a book purchase, your download link has been sent to your email. If this was a verification request, our team will review it shortly.
        </p>
        <a href="/" className="btn-primary">
          <span>Back to Campus</span>
        </a>
      </div>
    </div>
  )
}