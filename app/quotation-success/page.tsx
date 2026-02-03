'use client';

export default function QuotationSuccessPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '48px',
        maxWidth: '600px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#d4edda',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#155724" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: 600,
          marginBottom: '16px',
          color: '#0d0d0d'
        }}>
          Thank You!
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          Your quotation request has been submitted successfully. We'll review your request and send you a personalized quotation within 24-48 hours.
        </p>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '8px'
          }}>
            <strong>What happens next?</strong>
          </p>
          <ul style={{
            fontSize: '14px',
            color: '#666',
            paddingLeft: '20px',
            margin: 0
          }}>
            <li>We'll review your request</li>
            <li>Our team will prepare a detailed quotation</li>
            <li>You'll receive an email with the quotation</li>
            <li>We can answer any questions you may have</li>
          </ul>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a
            href="/"
            style={{
              padding: '12px 24px',
              backgroundColor: '#f24616',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              display: 'inline-block'
            }}
          >
            Continue Shopping
          </a>
          <a
            href="/kontaktier-uns"
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#f24616',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              border: '2px solid #f24616',
              display: 'inline-block'
            }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
