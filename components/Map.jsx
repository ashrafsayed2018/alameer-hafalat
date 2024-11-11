function Map() {
  return (
    <div className="mt-20">
      <h2 className="headingColor">موقعنا على الخريطه</h2>
      <span className="headingBorderColor"></span>
      <div className="w-full h-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d890603.0792594348!2d47.68021995!3d29.31407275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fc5363fbeea51a1%3A0x74726bcd92d8edd2!2z2KfZhNmD2YjZitiq4oCO!5e0!3m2!1sar!2skw!4v1731338533227!5m2!1sar!2skw"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          className="w-full h-[600px]"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  )
}

export default Map
