import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, User, Users, MessageSquare, Utensils } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export default function RsvpSection() {
  const { addRsvpResponse } = useWedding();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attendance: 'attending',
    guestCount: '1',
    dietary: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);

    setTimeout(() => {
      // Save to WeddingContext store & LocalStorage
      addRsvpResponse(formData);

      setLoading(false);
      setSubmitted(true);

      // Trigger celebration confetti
      if (formData.attendance === 'attending') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D9789E', '#C59B27', '#A9D4E6', '#8A2B49'],
        });
      }
    }, 600);
  };

  return (
    <section
      id="rsvp"
      className="section-container"
      style={{
        background: 'transparent',
      }}
    >
      <h2 className="section-title">დასწრების დადასტურება</h2>
      <p className="section-subtitle">
        გთხოვთ გვაცნობოთ თქვენი გადაწყვეტილება
      </p>

      <div
        className="glass-card"
        style={{
          maxWidth: '620px',
          width: '100%',
          padding: '40px 32px',
          borderRadius: '24px',
          margin: '0 auto',
        }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8A2B49, #D9789E)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                marginBottom: '20px',
                boxShadow: '0 10px 25px rgba(217, 120, 158, 0.3)',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h3
              className="font-heading"
              style={{
                fontSize: '26px',
                color: 'var(--burgundy)',
                marginBottom: '12px',
              }}
            >
              მადლობა, {formData.name}!
            </h3>

            <p
              style={{
                fontSize: '18px',
                color: 'var(--ink-dark)',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              {formData.attendance === 'attending'
                ? 'თქვენი პასუხი მიღებულია! მოუთმენლად ველოდებით ჩვენს შეხვედრას საქორწილო დღეს! ❤️'
                : 'გმადლობთ პასუხისთვის. გვწყინს, რომ ვერ შეძლებთ დასწრებას, თუმცა ვაფასებთ თქვენს ყურადღებას! 🌹'}
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="btn-secondary"
              style={{ fontSize: '12px' }}
            >
              ახალი პასუხის გაგზავნა
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Full Name */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--burgundy)',
                  marginBottom: '8px',
                }}
              >
                <User size={15} /> სახელი &amp; გვარი *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="მაგ: გიორგი ბერიძე"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  fontSize: '16px',
                  fontFamily: 'Cormorant Garamond, serif',
                  color: 'var(--ink-dark)',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                }}
              />
            </div>

            {/* Attendance Choice */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--burgundy)',
                  marginBottom: '10px',
                }}
              >
                დაესწრებით ქორწილს? *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, attendance: 'attending' }))}
                  style={{
                    padding: '14px 12px',
                    borderRadius: '12px',
                    border: formData.attendance === 'attending' ? '2px solid var(--burgundy)' : '1px solid var(--glass-border)',
                    background: formData.attendance === 'attending' ? 'rgba(249, 241, 235, 0.85)' : 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: formData.attendance === 'attending' ? 'var(--burgundy)' : 'var(--ink-muted)',
                    fontWeight: formData.attendance === 'attending' ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontFamily: 'Cormorant Garamond, serif',
                    transition: 'all 0.2s ease',
                  }}
                >
                  ✨ სიხარულით დავესწრები
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, attendance: 'declined' }))}
                  style={{
                    padding: '14px 12px',
                    borderRadius: '12px',
                    border: formData.attendance === 'declined' ? '2px solid var(--burgundy)' : '1px solid var(--glass-border)',
                    background: formData.attendance === 'declined' ? 'rgba(249, 241, 235, 0.85)' : 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: formData.attendance === 'declined' ? 'var(--burgundy)' : 'var(--ink-muted)',
                    fontWeight: formData.attendance === 'declined' ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontFamily: 'Cormorant Garamond, serif',
                    transition: 'all 0.2s ease',
                  }}
                >
                  💔 სამწუხაროდ ვერ შევძლებ
                </button>
              </div>
            </div>

            {formData.attendance === 'attending' && (
              <>
                {/* Guest Count */}
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--burgundy)',
                      marginBottom: '8px',
                    }}
                  >
                    <Users size={15} /> სტუმრების რაოდენობა
                  </label>
                  <select
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      fontSize: '16px',
                      fontFamily: 'Cormorant Garamond, serif',
                      color: 'var(--ink-dark)',
                      outline: 'none',
                    }}
                  >
                    <option value="1">1 პერსონა (მხოლოდ მე)</option>
                    <option value="2">2 პერსონა (+1 მეწყვილე)</option>
                    <option value="3">3 პერსონა</option>
                    <option value="4+">4 ან მეტი პერსონა (ოჯახით)</option>
                  </select>
                </div>

                {/* Dietary Preferences */}
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--burgundy)',
                      marginBottom: '8px',
                    }}
                  >
                    <Utensils size={15} /> კვებითი უპირატესობა / შენიშვნა
                  </label>
                  <input
                    type="text"
                    name="dietary"
                    placeholder="მაგ: ვეგეტარიანული / ალერგია..."
                    value={formData.dietary}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      fontSize: '16px',
                      fontFamily: 'Cormorant Garamond, serif',
                      color: 'var(--ink-dark)',
                      outline: 'none',
                    }}
                  />
                </div>
              </>
            )}

            {/* Warm Wishes / Message */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--burgundy)',
                  marginBottom: '8px',
                }}
              >
                <MessageSquare size={15} /> სურვილი წყვილისთვის / მილოცვა
              </label>
              <textarea
                name="message"
                rows="3"
                placeholder="დაუტოვეთ თბილი სიტყვები წყვილს..."
                value={formData.message}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  fontSize: '16px',
                  fontFamily: 'Cormorant Garamond, serif',
                  color: 'var(--ink-dark)',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
              {loading ? (
                'იგზავნება...'
              ) : (
                <>
                  <Send size={16} />
                  პასუხის გაგზავნა
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
