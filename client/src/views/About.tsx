import React from 'react'

const About: React.FC = () => {
  return (
    <div className='rounded-box grid border-4 bg-[#f2f7ff] p-8 sm:m-12 sm:mx-auto sm:w-3/5'>
      <div className='flex flex-col justify-self-center'>
        <div className='grid justify-items-center'>
          <h1 className='text-4xl font-bold'>The Mobile List</h1>
          <br />
          <p className='text-center'>
            Ever since the use of high refresh rate &#40;HRR&#41; displays and FPS bypass became popular, Geometry Dash
            has become a very competitive game. Since the main demon list, Pointercrate, is HRR based and full of levels
            that are inaccessible to mobile players, we have created this list which maintains the top 100 most
            difficult demons beaten by mobile players on 60hz.
          </p>
        </div>
        <div className='divider' />
        <div className='grid justify-items-center'>
          <h3 className='text-2xl'>How it Works</h3>
          <br />
          <ul className='list-disc'>
            <li>
              Remember&#58; this is a mobile-based list. These levels may not be in the order that computer players want
              them to be in.
            </li>
            <li>The levels are organized from hardest to easiest, hardest at &#35;1, easiest at &#35;100.</li>
            <li>The records are ordered by who beat the level first, with the first victor at the top.</li>
            <li>Records above 60hz will only be added if the level is already placed on the list.</li>
            <li>
              LDM &#40;Low Detail Mode&#41; versions of levels are accepted, as long as it does not affect the
              difficulty of the level.
            </li>
            <li>Illegitimate records will be removed, along with any other records that person holds.</li>
            <li>As of 12/15/17 only levels that have been demons at one point or another will be added.</li>
            <li>
              Using &ldquo;force smooth fix&rdquo; or any other method of slowing down your device won&#39;t get your
              record on the list.
            </li>
            <li>Records submitted where a mouse or controller is used will not be accepted.</li>
            <li>Levels are placed at most 2 months after the date of completion.</li>
            <li>
              For an updated level to be added, the update must stay true to the original. The general gameplay of the
              level should remain the same, excluding buffs, nerfs, and bugfixes. Updates that do not resemble the
              original level will not be added to the list. The update must also be harder than the original by 2 or
              more positions. If the level is nerfed, it will simply be moved down, retaining its records.
            </li>
            <li>Physics bypass is not allowed on the list.</li>
          </ul>
        </div>
        <div className='divider' />
        <div className='grid justify-items-center'>
          <h3 className='text-2xl'>The Team</h3>
          <br />
          <div className='flex place-items-start justify-items-center gap-x-12'>
            <div className='grid justify-items-center gap-y-1'>
              <h5 className='text-lg font-bold'>Owners</h5>
              <p>MiniWheatDuo</p>
              <p>Coopersuper</p>
            </div>
            <div className='grid justify-items-center gap-y-1'>
              <h5 className='text-lg font-bold'>Editors</h5>
              <p>Batle</p>
              <p>Bigthunder556</p>
              <p>Cappyt</p>
              <p>Mike139115</p>
              <p>Hilo</p>
              <p>DreamTide</p>
              <p>Nell</p>
              <p>Venfy</p>
              <p>SubZeroV</p>
              <p>Rusty</p>
            </div>
            <div className='grid justify-items-center gap-y-1'>
              <h5 className='text-lg font-bold'>Developer</h5>
              <p>Zoink Doink</p>
              <br />
              <h5 className='text-lg font-medium'>
                <em>Assistants</em>
              </h5>
              <p>gdhpsk</p>
              <p>Amp1ify</p>
              <p>Surpl3x</p>
              <p>Zeth</p>
            </div>
          </div>
        </div>
        <div className='divider' />
        <div className='grid justify-items-center'>
          <h3 className='text-2xl'>Contact Us</h3>
          <br />
          <p className='text-center'>
            For questions/concerns about the rules or the list in general, reach out to{' '}
            <strong className='select-all'>MiniWheatDuo&#35;2088</strong> on discord.
          </p>
          <p className='text-center'>
            For questions/concerns about the site, reach out to{' '}
            <strong className='select-all'>Zoink Doink&#35;1995</strong> on discord.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
