Python: Get Discount From String
################################
:date: 2013-09-11 11:41
:author: nomed
:category: Code
:tags: python
:slug: python-get-discount-from-string

 

-  DSTR: 4+4
-  PRICE: 2.78
-  FINAL PRICE: 2.562

.. code-block:: python

    def get_discount_from_string(dstr):
        dvals = dstr.split('+')
        mult = 1
        for d in dvals:
            d = d.strip()
            if d:
                mult = (1 - float(d)/100)*mult
        return mult

::

    >>> dstr="4+4"
    >>> get_discount_from_string(dstr)
    0.9216
    >>> x=get_discount_from_string(dstr)
    >>> price=2.78
    >>> final_price=price*x
    >>> final_price
    2.562048
    >>> dstr="4+4"
    >>> x=get_discount_from_string(dstr)
    >>> x
    0.9216
    >>> price=2.78
    >>> price
    2.78
    >>> final_price=price*x
    >>> final_price
    2.562048

