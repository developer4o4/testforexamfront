import React from 'react';
import "./footer.scss";
import Link from 'next/link';

const Footer = () => {
    return (
        <div className='footer'>
            <div className="footer-inner">
                <div className="footer-containers loo">
                    <Link href="/" className='logo'>
                        <img src="/logo/logo.png" alt="" />
                    </Link>
                    <p><span>Sapfir School</span> — zamonaviy bilim, mustahkam tarbiya va har bir bola uchun alohida yondashuv markazi.</p>
                </div>
                <div className="footer-containers">
                    <h2>Bo'limlar</h2>
                    <div className="hrefs">
                        <Link href="/">Bosh sahifa</Link>
                        <Link href="/about-us">Biz haqimizda</Link>
                        <Link href="/tests/contests">Musobaqalar</Link>
                        <Link href="/works">Vazifalar</Link>
                    </div>
                </div>
                <div className="footer-containers">
                    <h2>Murojaat uchun</h2>
                    <div className="hrefs">
                        <a href="tel:+998884804141">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAAXNSR0IArs4c6QAAAfxJREFUSEu91EmozWEYBvDflSFlIVJig5UUybCQkmFhSClJlIViQyTFwkIZFjZshJAhC8qwQKYNG1IkLIRSJDaUjBkyfq/eq+N07v/cg+tfp/9wvu953vf5nudt04VXWxdi++/g/bEUH7Ef75p0twyvcaR+XX3lU3Ac19A7F0/D9wqCDVnA1irwIHqGtTiEnriFXdhZt7EXJuS3xfiAo/l+BV/iubbyvriPgTVA43GxkA3Fi5rvY7Et34fgK57k+3LcrQfvlu31wbcaoJDpJA53IM1GvEWlLLH3TmGd386MwTiL6SlZI/xNeNMZ8L24WaTZXXQegNul3SW4UHGgM7Pjy83cMqtou7K4JTaMwgmMxKc/CVu9FUP3h5ia90tpy3X/Ajww4rQnFecswCBcLWcxDzdaJWgU//DwvZK61ThVnDIa54vn5+B6HcEYPMLLRsQdzZZI5TGMy82R3AjJDmwpvyjgdN5jXCxq1FnV4IoNazAZrwrZiCR4n1WeweaU8EDmIDz/KyPNpuLcHAchyXN0xwp8zrHQPnMiePvwoKR1fbtEzcBj3UTswUFsT+BGEs9I4tmtgMfamDvRciQ1KjxXk+L4v0eGb1WRKez78+pM5bVV9sPCPIdhZe4/zRSHASKhv+WhVfB6OWKCDk9HPW4W/1ZzUrn+byuvBP8BHKVfGMYNfvwAAAAASUVORK5CYII=" alt="" />
                            <span>+998 (88) 480-41-41</span>
                        </a>
                        {/* <a href="">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAAXNSR0IArs4c6QAAAelJREFUSEvV1EuoTXEUx/HPJQOvRAyQ5DExQSQhEzMRGZgZyaMkEylKeZSbRBkoMfAqQsmjjBASkShKkQEZyMDAK5TEf2nRce4+e9/JTXad9j7//1rf/1rr/1urSx8+XX3I9s/hM7EW0zAVz/Gk/D+Ps3WZ10Xevzhux2rswWF84le2y8p7B55iJT5WHVIHP4JJWIL3Fc7huw/z8/e13aYTfCG6MQfhNLS8N2M6XmJ/lid4x/Es7f/id4JfT+MrGF4iu4YbuJl1X441uIuReIyx+NFKr4IPKY6vE/o96z0I61sco+abMDfXbpe6b8zD/phVwSfiMqakVXwfwqUW+OBy2FsMzLWDuIdjTZGPKmp4VNQxJg0D/AK7WxxnpAwn59pRRAlPNcEjm4hqAj4gdH4aKzK6caXOB3ALexN2J8v2sAke+9EcZ3AujdelQl4hyhbZbMA3jMimikwbLzR4i7A1pdg0fnahH7b0VudRmgfFaWfR9oUa+vgSyP2U55vewsMuLu1iUc4s9HDEAFzFyRwNPWJomopRmtB0tPjnNu8TGIalnTJrgsd+aHd0Qr7k4Ir2n40FFYfWNlF7IDEdY7xGl8YQ24bFRdfz8K7utpsi/+0bB8TlrkLMnRgF0Qu1T2/hTZzK/f8X/hPdClYYO0lQ6AAAAABJRU5ErkJggg==" alt="" />
                        <span>Andijon viloyati, Paxtaobod tumani, Oltin yo'l ko'chasi</span>
                    </a> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer