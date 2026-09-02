import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import toast from 'react-hot-toast';

const formSchema = {
  name: { required: 'Name is required' },
  email: { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } },
  phone: { required: false },
  subject: { required: 'Subject is required' },
  message: { required: 'Message is required', minLength: { value: 10, message: 'Message must be at least 10 characters' } },
};

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post('/contact', data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark-900 mb-2">Get in Touch</h1>
          <p className="text-dark-600">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="card p-8">
              <h2 className="font-display text-xl font-bold text-dark-900 mb-6">Visit Us</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900">Address</h3>
                    <p className="text-dark-600">123 Main Street<br />City, State 12345</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900">Phone</h3>
                    <p className="text-dark-600">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900">Email</h3>
                    <p className="text-dark-600">info@robocutz.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="font-display text-xl font-bold text-dark-900 mb-6">Hours of Operation</h2>
              <div className="space-y-3">
                {[
                  { day: 'Monday - Thursday', hours: '9:00 AM - 7:00 PM' },
                  { day: 'Friday', hours: '9:00 AM - 8:00 PM' },
                  { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
                  { day: 'Sunday', hours: '10:00 AM - 4:00 PM' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-dark-100 last:border-0">
                    <span className="text-dark-600">{item.day}</span>
                    <span className="font-medium text-dark-900">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="font-display text-xl font-bold text-dark-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div>
                <label htmlFor="name" className="label">Name *</label>
                <input
                  id="name"
                  type="text"
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Your name"
                  {...register('name', { required: formSchema.name.required })}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && <p id="name-error" className="mt-1 text-sm text-red-500" role="alert">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="label">Email *</label>
                <input
                  id="email"
                  type="email"
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="your@email.com"
                  {...register('email', { 
                    required: formSchema.email.required,
                    pattern: formSchema.email.pattern,
                  })}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="label">Phone (optional)</label>
                <input
                  id="phone"
                  type="tel"
                  className="input"
                  placeholder="(555) 123-4567"
                  {...register('phone')}
                />
              </div>

              <div>
                <label htmlFor="subject" className="label">Subject *</label>
                <select
                  id="subject"
                  className={`input ${errors.subject ? 'input-error' : ''}`}
                  {...register('subject', { required: formSchema.subject.required })}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                >
                  <option value="">Select a subject</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="services">Services Question</option>
                  <option value="products">Products</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && <p id="subject-error" className="mt-1 text-sm text-red-500" role="alert">{errors.subject.message}</p>}
              </div>

              <div>
                <label htmlFor="message" className="label">Message *</label>
                <textarea
                  id="message"
                  rows={5}
                  className={`input ${errors.message ? 'input-error' : ''}`}
                  placeholder="Tell us how we can help..."
                  {...register('message', { 
                    required: formSchema.message.required,
                    minLength: formSchema.message.minLength,
                  })}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && <p id="message-error" className="mt-1 text-sm text-red-500" role="alert">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-4"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}