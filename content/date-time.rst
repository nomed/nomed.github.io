Date - Time
###########
:date: 2012-03-17 15:03
:author: nomed
:category: Code
:slug: date-time

-  Year=2013
-  Month=11
-  Day=6
-  H=15
-  Min=30

::

    >>> from datetime import date, datetime, time
    >>> from babel.dates import format_date, format_datetime, format_time

    >>> d = date(2011, 6, 11)
    >>> format_date(d, locale='en')
    u'Apr 1, 2007'
    >>> format_date(d, locale='de_DE')
    u'01.04.2007'

    >>> format_date(d, locale='it_IT')
    u'11/giu/2013'
    >>> format_date(d, locale='it')
    u'11/giu/2013'
    >>> format_date(d, format='long', locale='it_IT')
    u'11 giugno 2013'
    >>> format_date(d, format='full', locale='it_IT')
    u'marted\xec 11 giugno 2013'
    >>> print format_date(d, format='full', locale='it_IT')
    martedì 11 giugno 2013

    >>> dt = datetime(2013, 6, 11, 15, 30)
    >>> format_datetime(dt, format='full', locale='it_IT')
    u'marted\xec 11 giugno 2013 15.30.00 Mondo (GMT)'

Get week in month
-----------------

.. raw:: html

   <h2>

::

    >>> format_date(d, "W", locale='en')
    u'3'
    >>> format_date(d, "W", locale='it')
    u'3'

Get week in year
----------------

.. raw:: html

   <h2>

::

    >>> format_date(d, "w", locale='en')
    u'24'
    >>> format_date(d, "w", locale='it')
    u'24'

Get day in year
---------------

.. raw:: html

   <h2>

::

    >>> format_date(d, "D", locale='it')
    u'162'
    >>> format_date(d, "D", locale='en')
    u'162'

Time Table
==========

::


    +--------------+-----+------+---------+-----------+------------+----------+
    | year | month | day | hour | minutes | week_year | week_month | day_year |
    +------+-------+-----+------+---------+-----------+------------+----------+
    | 2013 |  6    | 11  | 15   | 31      | 24        |  3         | 162      |
    +------+-------+-----+------+---------+-----------+------------+----------+
    | 2012 |  6    | 11  | 15   | 31      | 25        |  3         | 163      |
    +------+-------+-----+------+---------+-----------+------------+----------+
    | 2012 | 12    | 31  | 23   | 59      | 54        |  6         | 366      |
    +------+-------+-----+------+---------+-----------+------------+----------+

