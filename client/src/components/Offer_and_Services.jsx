import React from 'react'

const Offer_and_Services = () => {
  return (
    <>
         <section className="section ec-ser-spe-section section-space-p">
        <div className="container" >
            <div className="row">
               
                <div className="ec-test-section col-lg-3 col-md-6 col-sm-12 col-xs-6 sectopn-spc-mb" >
                    <div className="col-md-12">
                        <div className="section-title">
                            <h2 className="ec-title">Testimonial</h2>
                        </div>
                    </div>
                    <div className="ec-test-outer">
                        <ul id="ec-testimonial-slider">
                            <li className="ec-test-item">
                                <div className="ec-test-inner">
                                    <div className="ec-test-img">
                                        <img alt="testimonial" title="testimonial"
                                            src="assets/images/testimonial/1.jpg" />
                                    </div>
                                    <div className="ec-test-content">
                                        <div className="ec-test-name">mark jofferson</div>
                                        <div className="ec-test-designation">- CEO & Founder Invision</div>
                                        <div className="ec-test-divider">
                                            <i className="fi-rr-quote-right"></i>
                                        </div>
                                        <div className="ec-test-desc">Lorem ipsum dolor sit amet consectetur Lorem ipsum
                                            dolor dolor sit amet.
                                        </div>
                                    </div>
                                </div>
                            </li>
                            {/* <li className="ec-test-item">
                                <div className="ec-test-inner">
                                    <div className="ec-test-img">
                                        <img alt="testimonial" title="testimonial"
                                            src="assets/images/testimonial/2.jpg" />
                                    </div>
                                    <div className="ec-test-content">
                                        <div className="ec-test-name">mark jofferson</div>
                                        <div className="ec-test-designation">- CEO & Founder Invision</div>
                                        <div className="ec-test-divider">
                                            <i className="fi-rr-quote-right"></i>
                                        </div>
                                        <div className="ec-test-desc">Lorem ipsum dolor sit amet consectetur Lorem ipsum
                                            dolor dolor sit amet.
                                        </div>
                                    </div>
                                </div>
                            </li> */}
                            {/* <li className="ec-test-item">
                                <div className="ec-test-inner">
                                    <div className="ec-test-img">
                                        <img alt="testimonial" title="testimonial"
                                            src="assets/images/testimonial/3.jpg" />
                                    </div>
                                    <div className="ec-test-content">
                                        <div className="ec-test-name">mark jofferson</div>
                                        <div className="ec-test-designation">- CEO & Founder Invision</div>
                                        <div className="ec-test-divider">
                                            <i className="fi-rr-quote-right"></i>
                                        </div>
                                        <div className="ec-test-desc">Lorem ipsum dolor sit amet consectetur Lorem ipsum
                                            dolor dolor sit amet.
                                        </div>
                                    </div>
                                </div>
                            </li> */}
                        </ul>
                    </div>
                </div>
                
                <div className="col-md-6 col-sm-12">
                    <div className="ec-banner-inner">
                        <div className="ec-banner-block ec-banner-block-1">
                            <div className="banner-block">
                                <div className="banner-content">
                                    <div className="banner-text">
                                        <span className="ec-banner-disc">25% discount</span>
                                        <span className="ec-banner-title">Fashion & cosmetics</span>
                                        <span className="ec-banner-stitle">Starting @ $10</span>
                                    </div>
                                    <span className="ec-banner-btn"><a href="shop-left-sidebar-col-3.html">Shop Now <i
                                                className="ecicon eci-angle-double-right" aria-hidden="true"></i></a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="ec-services-section col-lg-3 col-md-3 col-sm-3" >
                    <div className="col-md-12">
                        <div className="section-title">
                            <h2 className="ec-title">Our Services</h2>
                        </div>
                    </div>
                    <div className="ec_ser_block">
                        <div className="ec_ser_content ec_ser_content_1 col-sm-12">
                            <div className="ec_ser_inner">
                                <div className="ec-service-image">
                                    <i className="fi fi-ts-truck-moving"></i>
                                </div>
                                <div className="ec-service-desc">
                                    <h2>Worldwide Delivery</h2>
                                    <p>For Order Over $100</p>
                                </div>
                            </div>
                        </div>
                        <div className="ec_ser_content ec_ser_content_2 col-sm-12">
                            <div className="ec_ser_inner">
                                <div className="ec-service-image">
                                    <i className="fi fi-ts-tachometer-fast"></i>
                                </div>
                                <div className="ec-service-desc">
                                    <h2>Next Day delivery</h2>
                                    <p>UK Orders Only</p>
                                </div>
                            </div>
                        </div>
                        <div className="ec_ser_content ec_ser_content_3 col-sm-12">
                            <div className="ec_ser_inner">
                                <div className="ec-service-image">
                                    <i className="fi fi-ts-circle-phone"></i>
                                </div>
                                <div className="ec-service-desc">
                                    <h2>Best Online Support</h2>
                                    <p>Hours: 8AM -11PM</p>
                                </div>
                            </div>
                        </div>
                        <div className="ec_ser_content ec_ser_content_4 col-sm-12">
                            <div className="ec_ser_inner">
                                <div className="ec-service-image">
                                    <i className="fi fi-ts-badge-percent"></i>
                                </div>
                                <div className="ec-service-desc">
                                    <h2>Return Policy</h2>
                                    <p>Easy & Free Return</p>
                                </div>
                            </div>
                        </div>
                        <div className="ec_ser_content ec_ser_content_5 col-sm-12">
                            <div className="ec_ser_inner">
                                <div className="ec-service-image">
                                    <i className="fi fi-ts-donate"></i>
                                </div>
                                <div class="ec-service-desc">
                                    <h2>30% money back</h2>
                                    <p>For Order Over $100</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    </section>
    </>
  )
}

export default Offer_and_Services