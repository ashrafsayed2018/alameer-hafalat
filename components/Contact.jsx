'use client'

import {
  faClock,
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SiteInfo } from '../app/data'

function Contact() {
  const pathName = usePathname()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: '',
  })

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  }) // Add state to track errors

  const isFormValid = () => {
    return (
      formData.name != '' &&
      formData.phone != null &&
      formData.email != '' &&
      formData.message != ''
    )
  }
  const handleSubmit = (event) => {
    event.preventDefault()

    // Validate each field
    const newErrors = {
      name: formData.name === '',
      email: formData.email === '',
      message: formData.message === '',
    }

    setErrors(newErrors) // Update errors state

    if (!isFormValid()) {
      toast.error('من فضلك اكمل البيانات')

      return
    } else {
      toast.success('تم الارسال بنجاح')
      setFormData({
        name: '',
        email: '',
        message: '',
        phone: '',
      })
    }
  }
  return (
    <div className="mt-28 px-4 md:px-6 lg:px-8 xl:px-10">
      {pathName != '/contact' ? (
        <>
          <h2 className="headingColor">الاتصال</h2>
          <span className="headingBorderColor"></span>
        </>
      ) : (
        <div></div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 gap-y-16">
        {/* contact info */}
        <div className="contact-info">
          <h2 className="headingColor">معلومات الاتصال</h2>
          <span className="headingBorderColor"></span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="textColor text-2xl"
              />
              <p className="textColor text-xl">الكويت</p>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faPhone} className="textColor text-2xl" />
              <p className="textColor text-xl">{SiteInfo.mobileNumber}</p>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="textColor text-2xl"
              />
              <p className="textColor text-xl">xyz@gmail.com</p>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faClock} className="textColor text-2xl" />
              <p className="textColor text-xl">24 ساعة</p>
            </div>
          </div>
        </div>
        {/* contact form */}
        <div className="contact-form">
          <form className="max-w-full mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="الاسم"
                className={`w-full px-3 py-2 rounded-xl outline-none border-[2px] ${
                  errors.name ? 'border-red-500' : 'border-gray-400'
                } hover:border-blue-400`}
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="الهاتف"
                className={`w-full px-3 py-2 rounded-xl outline-none border-[2px] border-gray-400
                hover:border-blue-400`}
                name="number"
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
              />
            </div>
            <div className="mt-5">
              <input
                type="email"
                placeholder="البريد الالكتروني"
                className={`w-full px-3 py-2 rounded-xl outline-none border-[2px] ${
                  errors.email ? 'border-red-500' : 'border-gray-400'
                } hover:border-blue-400`}
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="mt-5">
              <textarea
                className={`w-full px-3 py-2 rounded-xl outline-none border-[2px] h-28 resize-none ${
                  errors.message ? 'border-red-500' : 'border-gray-400'
                } hover:border-blue-400`}
                placeholder="الرسالة"
                name="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              ></textarea>
            </div>
            <button
              type="submit"
              className="mt-5 themeBgColor hoverBgColor text-white w-full py-3 rounded-xl"
              onClick={handleSubmit}
            >
              ارسال
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Contact
