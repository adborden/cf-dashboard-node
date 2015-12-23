// +build acceptance

package util

import (
	"strings"

	. "github.com/onsi/gomega"
	"github.com/sclevine/agouti"
)

type Nav struct {
	page *agouti.Page
	base *agouti.Selection
}

var baseSelector = ".test-nav-primary"

func SetupNav(page *agouti.Page) Nav {
	return Nav{page, page.First(baseSelector)}
}

func SetupClickFirstOrg(page *agouti.Page) Nav {
	var nav = SetupNav(page)
	return nav.ClickFirstOrg()
}

func (n Nav) ClickOrg(orgName string) Nav {
	var sel = n.base.FindByLink(strings.ToLower(orgName))
	Eventually(Expect(sel.Click()).To(Succeed()))
	return Nav{n.page, sel}
}

func (n Nav) ClickFirstOrg() Nav {
	Expect(n.base.First(".test-nav-org").Click()).To(Succeed())
	return Nav{n.page, n.base.First(".test-nav-org")}
}

func (n Nav) ClickSpaces() Spaces {
	Expect(n.base.FindByLink("Spaces").Click()).To(Succeed())
	return Spaces{n.page}
}

func (n Nav) ClickOrgSpaces(orgName string) Spaces {
	var orgNav = n.ClickOrg(orgName)
	var currentNavList = orgNav.base.FindByXPath("ancestor::ul")

	var spacesLink = currentNavList.FindByLink("Spaces")

	Eventually(Expect(spacesLink.Click()).To(Succeed()))
	return Spaces{orgNav.page}
}

func (n Nav) ClickMarketplace() Marketplace {
	Expect(n.base.FindByLink("Marketplace").Click()).To(Succeed())
	return Marketplace{n.page}
}
