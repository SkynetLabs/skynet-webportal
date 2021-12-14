export default function Maintenance() {
  return (
    <div className="maintenance-gradient">
      <div className="container mx-auto">
        <section className="flex flex-wrap lg:flex-nowrap justify-center h-screen relative">
          <div className="my-auto font-poppins text-palette-600 text-center lg:text-left">
            <h1 className="font-bold text-5xl pb-5">
              Skynet Accounts <br /> is down for maintenance
            </h1>

            <p className="lg:w-5/6 pb-1">we are upgrading the service and should be back soon</p>
            <p className="lg:w-5/6">you can always contact us at hello@siasky.net</p>

            <a
              className="block lg:w-5/6 pt-5 text-xs hover:underline cursor-pointer text-palette-500 hover:text-palette-600"
              href="https://siasky.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 32 32"
                className="inline-block transform rotate-180 fill-current"
              >
                <path
                  fillRule="evenodd"
                  d="M17.4969298,9.4969297 L17.4960469,19.1129297 L20.7869064,15.797325 L22.2069531,17.2056813 L17.2526515,22.2011078 C16.8937661,22.5629722 16.3268563,22.5931492 15.9333017,22.289983 L15.8387453,22.2072458 L10.7930469,17.2072458 L12.2008126,15.7866136 L15.4960469,19.0519297 L15.4969298,9.4969297 L17.4969298,9.4969297 Z"
                  transform="rotate(-90 16.5 15.997)"
                />
              </svg>
              go back to siasky.net
            </a>
          </div>
          <div className="my-auto text-center w-3/4 lg:w-2/5">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="animate-wiggle">
              <title>Skynet</title>
              <path d="m-.0004 6.4602 21.3893 11.297c.561.2935.6633 1.0532.1999 1.4846h-.011a10.0399 10.0399 0 0 1-2.2335 1.5307c-6.912 3.4734-14.9917-1.838-14.5438-9.5605l2.8601 1.9752c.856 4.508 5.6187 7.1094 9.8742 5.3932zm8.6477 3.1509 14.3661 5.6785a.8704.8704 0 0 1 .5197 1.0466v.0182c-.1537.5377-.7668.7938-1.2575.5252zm5.2896-7.4375c2.7093-.2325 6.0946.7869 8.1116 3.3871 1.699 2.1951 2.0497 4.8772 1.9298 7.6465v-.007c-.0478.5874-.6494.9616-1.1975.745l-9.7652-3.8596 9.0656 2.4313a7.296 7.296 0 0 0-1.0677-4.5631c-2.9683-4.7678-9.9847-4.5344-12.6297.4201a7.5048 7.5048 0 0 0-.398.8831L5.5546 7.9614c.069-.1017.1417-.198.2144-.2962.1163-.2416.2417-.487.3798-.7268 1.6118-2.7911 4.3102-4.4338 7.1558-4.6973.2108-.0182.4215-.049.6323-.0672z" />
            </svg>
          </div>
        </section>
      </div>
    </div>
  );
}
