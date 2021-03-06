import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template

class KnowledgeMap(webapp.RequestHandler):
    def get(self):
        template_values = {}
        #path = os.path.join(os.path.dirname(__file__), 'example3.html')
        path = os.path.join(os.path.dirname(__file__), 'knowledge_map.html')
        self.response.out.write(template.render(path, template_values))

if __name__ == '__main__':
    application = webapp.WSGIApplication([('/', KnowledgeMap)], debug=True)
    run_wsgi_app(application)
