Epos & Magento Integration
##########################
:date: 2013-04-30 01:57
:author: nomed
:category: Code
:slug: braindump-product-object

My idea is to migrate products from a POS system db to Magento.

Thanks to sqlalchemy i can easly query the POS database, currently based
on Firebird.

Magento has web services and XML-RPC based are my choice.

As to reinvent the wheel is not my goal i usually ask to google:

``Keyword: python magento``

| https://github.com/voberoi/python-magento\ (Activity: 2 months ago)
| https://github.com/openlabs/magento\ (Activity: 3 years ago)
| http://code.google.com/p/python-magento\ (Activity: 3 years ago)


On my localhost Magento Community edition:

``http://localhost:80/magento17/``

I can test *python-magento*.

API Documentation: `Magento API Soap /
XML-RPC <http://www.magentocommerce.com/api/soap/introduction.html>`__

::

    >>>> from magento import MagentoAPI
    >>> magento = MagentoAPI("localhost", 80, "robot", "test_api_key", path="/magento17/index.php/api/xmlrpc", verbose=True)
    >>> catalog_product_type.list ()
    [
     {'type': 'simple', 'label': 'Prodotto semplice'},
     {'type': 'grouped', 'label': 'Prodotti raggruppati'},
     {'type': 'configurable', 'label': 'Prodotto configurabile'},
     {'type': 'virtual', 'label': 'Prodotto virtuale'},
     {'type': 'bundle', 'label': 'Prodotto Bundle'},
     {'type': 'downloadable', 'label': 'Prodotti scaricabili'}
    ]
    >>> magento.catalog_category.level()
    [
     {'name': 'Default Category', 'level': '1', 'is_active': '1', 'parent_id': 1, 'position': '1', 'category_id': '2'},
     {'name': 'Ortofrutta', 'level': '1', 'is_active': '1', 'parent_id': 1, 'position': '2', 'category_id': '3'}
    ]

As first step i decided to sync a mini market db, following my python
object.

.. code-block:: python
   :linenos:

    from ebetl.model import *
    from magento import MagentoAPI
    import transaction

    class MagentoObj(object):
        def __init__(self, config, *args, **kw):
            self.config=config
            self.host = config.get('magento.host')
            self.port = config.get('magento.port')
            self.user = config.get('magento.user')
            self.password=config.get('magento.password')
            self.path = config.get('magento.path')
            self.api = MagentoAPI(self.host,
                                  self.port,
                                  self.user,
                                  self.password,
                                  self.path,
                                  #verbose=False
                                  )

        def category(self, *args, **kw):
            """
            Sync Magento-Categories and DBretail-Reparti
            """
            db_categories = DBSession.query(Reparti).all()
            for db_cat in db_categories:

                category_data = {
                    'name' : db_cat.reparto,
                    'is_active' : 1,
                    'include_in_menu' : 1,
                    'available_sort_by':'position',
                    'default_sort_by':'position'}

                if db_cat.updtablog == None:
                    # create a new category in root (1)
                    new_id = self.api.catalog_category.create(1,category_data)
                    db_cat.updtablog = new_id
                    DBSession.add(db_cat)
                else:
                    # update category
                    self.api.catalog_category.update(db_cat.updtablog, category_data)
            transaction.commit()

        def product(self, *args, **kw):
            """
            Sync Magento-Products and DBretail-Prodotti
            """
            db_products = DBSession.query(Prodotti).all()
            for db_prod in db_products:
                #prezzo = db_prod.prezzo

                product_data = {
                    'name': db_prod.prodotto,
                    'price' : 0,
                    'weight': 0,
                    'category_ids': db_prod.reparto.updtablog,
                    'description' : db_prod.prodotto,
                    'short_description' :db_prod.prodotto,
                    'websites':['base'],
                    'tax_class_id': 2,
                    'status': 1,
                }

                if db_prod.updtablog == None:
                    attribute_set_id = 4
                    new_id = self.api.catalog_product.create('simple', attribute_set_id, db_prod.codiceprodotto, product_data)
                    db_prod.updtablog = new_id
                    DBSession.add(db_prod)
                else:
                    self.api.catalog_category.update(db_prod.updtablog, product_data)
            transaction.commit()

At this stage i can sync:

-  Categories: code, description
-  Products: sku, description, category

Next step will be to sync more products attributes.

Main issue i found is that Magento does not seem to support many Eans
for a single product, the default field that could be use is sku that i
decided to populate with product code.
